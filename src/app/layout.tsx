export const metadata = { title: 'Guild Con', description: 'Guild Con site' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{fontFamily:'system-ui, sans-serif', margin:0, padding:20, background:'#0b0f12', color:'#e6f2ff'}}>
        <main style={{maxWidth:960, margin:'0 auto'}}>{children}</main>
      </body>
    </html>
  )
}

