'use client'

import { Alert, Button, ImageList, ImageListItem, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { drawerWidth, footerHeight } from "../../settings";
import Image from "next/image";
import EditLock from "@components/EditLock";
import RestrictedAccess from "@components/Restricted";
import { authClient } from "@lib/auth-client";
import Waiting from "@/app/components/Waiting";

export default function GalleryYear({params}: {params: Promise<{ year: string }>}) {
  const { data } = authClient.useSession()
  const [locked, setLocked] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])
  const [galleryUrls, setGalleryUrls] = useState<string[]>([])
  const [resolvedParams, setResolvedParams] = useState<{ year: string } | null>(null) 
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function fetchImages() {
      setResolvedParams(await params)
      if (resolvedParams) {
        try {
          const res = await fetch(`/api/queries/getImages?prefix=images/${resolvedParams.year}/gallery/`);
          if (!res.ok) {
            throw new Error('Failed to fetch images');
          }
          const data = await res.json();
          setGalleryUrls(data.images || []);
        } catch (error) {
          console.error('Error fetching images:', error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchImages();
  }, [params, resolvedParams]);

  async function handleUpload(file: File | null){
    if (!file) return
    setUploading(true)
    setUploadError(null)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('year', resolvedParams?.year || '')
      const res = await fetch('/api/queries/uploadImage', {
        method: 'PUT',
        body: form
      })
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}))
        throw new Error(payload?.error || 'Upload failed')
      }
      const blob = await res.json()
      if (blob?.url) {
        setUploadedUrls((prev) => [blob.url, ...prev])
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <Paper 
      sx={{
        ml: {
          sm: drawerWidth.sm,
          md: drawerWidth.md,
          lg: drawerWidth.lg
        },
        mb: footerHeight,
        position: 'relative',
        p: 2
      }}
    >
      <Waiting message={`Loading gallery images...`} open={loading}/>
      <EditLock locked={locked} setLocked={setLocked} userFirstName={data?.user.name}/>
      {!locked ? (
        <RestrictedAccess explicit={true}>
          <Stack spacing={1.5} sx={{ mb: 2 }}>
            <Typography variant="h6" color="primary.main">Upload a gallery image</Typography>
            <Button variant="contained" component="label" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Choose image'}
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) => handleUpload(e.target.files?.[0] ?? null)}
              />
            </Button>
            {uploadError ? <Alert severity="error">{uploadError}</Alert> : null}
          </Stack>
        </RestrictedAccess>
      ) : null}
      <ImageList sx={{ width: '100%', height: 'auto' }} cols={4} rowHeight={164}>
        {galleryUrls.map((url) => (
          <ImageListItem key={url}>
            <Image
              sizes="164px"
              src={url}
              loading="lazy" 
              alt=""
              width={164}
              height={164}
              style={{ width: 'auto', height: 'auto' }}
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Paper>
  );
};  

 