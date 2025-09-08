// Farcaster Frame API endpoint
export default function handler(req, res) {
  // Set CORS headers for Frame compatibility
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method === 'POST') {
    // Handle Frame action
    const { untrustedData, trustedData } = req.body

    // Process Frame action (like, tip, share)
    const action = untrustedData?.buttonIndex || 1
    const fid = untrustedData?.fid
    const castId = untrustedData?.castId

    // Log the action for analytics
    console.log('Frame action:', { action, fid, castId })

    // Return Frame response
    res.status(200).json({
      type: 'frame',
      frameUrl: `${process.env.VITE_FRAME_BASE_URL || 'https://tip-like.vercel.app'}/frame`,
      message: action === 1 ? 'Thanks for the tip!' : 'Thanks for sharing!'
    })
  } else if (req.method === 'GET') {
    // Return Frame metadata image
    const imageUrl = `${process.env.VITE_FRAME_BASE_URL || 'https://tip-like.vercel.app'}/frame-image.png`
    
    res.status(200).json({
      image: imageUrl,
      buttons: [
        { label: 'Like & Tip' },
        { label: 'Share' }
      ]
    })
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
