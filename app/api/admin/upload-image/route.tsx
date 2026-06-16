import { NextRequest, NextResponse } from 'next/server';
import { writeClient } from '@/sanity/lib/client';
import sharp from 'sharp';
import { ImageResponse } from 'next/og';
import React from 'react';

export async function POST(request: NextRequest) {
  try {
    console.time('[UPLOAD API] Total Time');
    console.time('[UPLOAD API] Read Request Body');
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    console.timeEnd('[UPLOAD API] Read Request Body');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.time('[UPLOAD API] Buffer Conversion');
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.timeEnd('[UPLOAD API] Buffer Conversion');

    console.time('[UPLOAD API] Sharp Init & Metadata');
    const image = sharp(buffer);
    const metadata = await image.metadata();
    console.timeEnd('[UPLOAD API] Sharp Init & Metadata');
    
    const width = metadata.width || 800;
    const height = metadata.height || 800;

    const scale = Math.max(0.5, width / 1000);
    const titleSize = Math.floor(48 * scale);
    const subtitleSize = Math.floor(24 * scale);

    console.time('[UPLOAD API] Satori Tile Generate');
    const tileWidth = Math.floor(400 * scale);
    const tileHeight = Math.floor(250 * scale);

    const tileRes = new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
          }}
        >
          <span
            style={{
              fontSize: titleSize,
              fontWeight: 900,
              color: 'rgba(255, 255, 255, 0.35)',
              textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)',
            }}
          >
            JEET FURNITURE
          </span>
          <span
            style={{
              fontSize: subtitleSize,
              color: 'rgba(255, 255, 255, 0.35)',
              textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)',
              marginTop: 5,
            }}
          >
            +91 78628 00530
          </span>
        </div>
      ),
      { width: tileWidth, height: tileHeight }
    );

    const tileBuffer = Buffer.from(await tileRes.arrayBuffer());
    const tileBase64 = tileBuffer.toString('base64');
    console.timeEnd('[UPLOAD API] Satori Tile Generate');

    console.time('[UPLOAD API] SVG Composite Generate');
    const svgString = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="wm" x="0" y="0" width="${tileWidth}" height="${tileHeight}" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
      <image href="data:image/png;base64,${tileBase64}" width="${tileWidth}" height="${tileHeight}" />
    </pattern>
  </defs>
  <rect x="0" y="0" width="100%" height="100%" fill="url(#wm)" />
</svg>`;
    const watermarkBuffer = Buffer.from(svgString);
    console.timeEnd('[UPLOAD API] SVG Composite Generate');

    // Composite the dynamically generated PNG watermark over the original image
    console.time('[UPLOAD API] Sharp Composite');
    const watermarkedBuffer = await image
      .composite([
        {
          input: watermarkBuffer,
          blend: 'over',
        },
      ])
      .webp({ quality: 80, effort: 4 })
      .toBuffer();
    console.timeEnd('[UPLOAD API] Sharp Composite');

    console.time('[UPLOAD API] Sanity Asset Upload');
    const asset = await writeClient.assets.upload('image', watermarkedBuffer, {
      filename: file.name,
      contentType: file.type,
    });
    console.timeEnd('[UPLOAD API] Sanity Asset Upload');

    console.timeEnd('[UPLOAD API] Total Time');
    return NextResponse.json({ assetId: asset._id });
  } catch (error: any) {
    console.error('Image upload failed:', error);
    return NextResponse.json({ error: error?.message || 'Unknown error occurred during image processing' }, { status: 500 });
  }
}
