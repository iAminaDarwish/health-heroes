# Cuts the four Yousif poses out of yousif-poses.png (cream background, ground shadows)
# into transparent, feet-aligned PNGs of one size. Run from the project root:
#   powershell -File assets-source\injection\cutout.ps1
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public static class Cutout
{
    // Distance from a pixel to the colour segment background..shadow.
    static double SegDist(byte[] p, int i, double[] a, double[] s)
    {
        double pr = p[i + 2] - a[0], pg = p[i + 1] - a[1], pb = p[i] - a[2];
        double vr = s[0] - a[0], vg = s[1] - a[1], vb = s[2] - a[2];
        double len = vr * vr + vg * vg + vb * vb;
        double t = len > 0 ? (pr * vr + pg * vg + pb * vb) / len : 0;
        if (t < 0) t = 0;
        if (t > 1) t = 1;
        double dr = pr - t * vr, dg = pg - t * vg, db = pb - t * vb;
        return Math.Sqrt(dr * dr + dg * dg + db * db);
    }

    static double[] Avg(byte[] p, int stride, int x, int y, int r)
    {
        double[] c = new double[3];
        int n = 0;
        for (int yy = y - r; yy <= y + r; yy++)
            for (int xx = x - r; xx <= x + r; xx++)
            {
                int i = yy * stride + xx * 4;
                c[0] += p[i + 2]; c[1] += p[i + 1]; c[2] += p[i];
                n++;
            }
        c[0] /= n; c[1] /= n; c[2] /= n;
        return c;
    }

    public static string Run(string src, string dst, int cx, int cy, int cw, int ch,
        double scale, int outW, int outH, int shadowX, int shadowY, double tol)
    {
        byte[] px;
        int stride;
        using (Bitmap bmp = new Bitmap(src))
        {
            BitmapData d = bmp.LockBits(new Rectangle(0, 0, bmp.Width, bmp.Height), ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
            stride = d.Stride;
            px = new byte[stride * bmp.Height];
            Marshal.Copy(d.Scan0, px, 0, px.Length);
            bmp.UnlockBits(d);
        }
        double[] bg = Avg(px, stride, 8, 8, 5);
        double[] sh = Avg(px, stride, shadowX, shadowY, 3);

        int n = cw * ch;
        double[] dist = new double[n];
        bool[] back = new bool[n];
        for (int y = 0; y < ch; y++)
            for (int x = 0; x < cw; x++)
                dist[y * cw + x] = SegDist(px, (cy + y) * stride + (cx + x) * 4, bg, sh);

        // Flood the background in from the crop border; outlines stop it.
        Queue<int> q = new Queue<int>();
        for (int x = 0; x < cw; x++) { q.Enqueue(x); q.Enqueue((ch - 1) * cw + x); }
        for (int y = 0; y < ch; y++) { q.Enqueue(y * cw); q.Enqueue(y * cw + cw - 1); }
        while (q.Count > 0)
        {
            int i = q.Dequeue();
            if (back[i] || dist[i] > tol) continue;
            back[i] = true;
            int x = i % cw, y = i / cw;
            if (x > 0) q.Enqueue(i - 1);
            if (x < cw - 1) q.Enqueue(i + 1);
            if (y > 0) q.Enqueue(i - cw);
            if (y < ch - 1) q.Enqueue(i + cw);
        }

        // Keep only the largest solid shape (the figure).
        int[] label = new int[n];
        int best = 0, bestSize = 0, next = 0;
        for (int s = 0; s < n; s++)
        {
            if (back[s] || label[s] != 0) continue;
            next++;
            int size = 0;
            q.Enqueue(s);
            label[s] = next;
            while (q.Count > 0)
            {
                int i = q.Dequeue();
                size++;
                int x = i % cw, y = i / cw;
                if (x > 0 && !back[i - 1] && label[i - 1] == 0) { label[i - 1] = next; q.Enqueue(i - 1); }
                if (x < cw - 1 && !back[i + 1] && label[i + 1] == 0) { label[i + 1] = next; q.Enqueue(i + 1); }
                if (y > 0 && !back[i - cw] && label[i - cw] == 0) { label[i - cw] = next; q.Enqueue(i - cw); }
                if (y < ch - 1 && !back[i + cw] && label[i + cw] == 0) { label[i + cw] = next; q.Enqueue(i + cw); }
            }
            if (size > bestSize) { bestSize = size; best = next; }
        }
        for (int i = 0; i < n; i++) if (label[i] != best) back[i] = true;

        // Soft edge: the two pixels next to the background get alpha from how far
        // their colour is from it, and lose the background's tint.
        byte[] outPx = new byte[n * 4];
        int x0 = cw, x1 = 0, y0 = ch, y1 = 0;
        for (int y = 0; y < ch; y++)
            for (int x = 0; x < cw; x++)
            {
                int i = y * cw + x;
                if (back[i]) continue;
                bool edge = false;
                for (int yy = Math.Max(0, y - 2); yy <= Math.Min(ch - 1, y + 2) && !edge; yy++)
                    for (int xx = Math.Max(0, x - 2); xx <= Math.Min(cw - 1, x + 2); xx++)
                        if (back[yy * cw + xx]) { edge = true; break; }
                int si = (cy + y) * stride + (cx + x) * 4;
                double a = edge ? Math.Min(1.0, dist[i] / 190.0) : 1.0;
                if (a < 0.1) continue;
                for (int c = 0; c < 3; c++)
                {
                    double b = bg[2 - c];
                    double v = b + (px[si + c] - b) / a;
                    outPx[i * 4 + c] = (byte)Math.Max(0, Math.Min(255, Math.Round(v)));
                }
                outPx[i * 4 + 3] = (byte)Math.Round(a * 255);
                if (x < x0) x0 = x;
                if (x > x1) x1 = x;
                if (y < y0) y0 = y;
                if (y > y1) y1 = y;
            }

        // Body centre: middle of the widest run of the torso rows, so a raised arm does not shift it.
        List<int> xs = new List<int>();
        int bandTop = y0 + (int)((y1 - y0) * 0.42), bandBottom = y0 + (int)((y1 - y0) * 0.58);
        for (int y = bandTop; y <= bandBottom; y++)
            for (int x = x0; x <= x1; x++)
                if (outPx[(y * cw + x) * 4 + 3] > 0) xs.Add(x);
        xs.Sort();
        int anchor = xs[xs.Count / 2];

        using (Bitmap cut = new Bitmap(cw, ch, PixelFormat.Format32bppArgb))
        using (Bitmap result = new Bitmap(outW, outH, PixelFormat.Format32bppArgb))
        {
            BitmapData d = cut.LockBits(new Rectangle(0, 0, cw, ch), ImageLockMode.WriteOnly, PixelFormat.Format32bppArgb);
            for (int y = 0; y < ch; y++) Marshal.Copy(outPx, y * cw * 4, IntPtr.Add(d.Scan0, y * d.Stride), cw * 4);
            cut.UnlockBits(d);
            using (Graphics g = Graphics.FromImage(result))
            {
                g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                g.CompositingQuality = CompositingQuality.HighQuality;
                float dx = (float)(outW / 2.0 - anchor * scale);
                float dy = (float)(outH - 4 - (y1 + 1) * scale);
                g.DrawImage(cut, new RectangleF(dx, dy, (float)(cw * scale), (float)(ch * scale)), new RectangleF(0, 0, cw, ch), GraphicsUnit.Pixel);
            }
            result.Save(dst, ImageFormat.Png);
        }
        return string.Format("{0}: figure {1}x{2}, scaled {3:0}x{4:0}, left {5:0} right {6:0} of centre",
            System.IO.Path.GetFileName(dst), x1 - x0 + 1, y1 - y0 + 1, (x1 - x0 + 1) * scale, (y1 - y0 + 1) * scale,
            (anchor - x0) * scale, (x1 - anchor) * scale);
    }
}
'@

$dir = $PSScriptRoot
$src = Join-Path $dir 'yousif-poses.png'
# name, crop x, crop width, a point inside that pose's ground shadow
$poses = @(
    @('walk1', 150, 610, 436, 1490),
    @('walk2', 770, 570, 1020, 1490),
    @('cheer', 1380, 610, 1680, 1490),
    @('wave', 2040, 560, 2260, 1490)
)
foreach ($p in $poses) {
    [Cutout]::Run($src, (Join-Path $dir "yousif-$($p[0]).png"), $p[1], 380, $p[2], 1156, 0.62, 380, 640, $p[3], $p[4], 15)
}
