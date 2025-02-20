// imported from https://github.com/nextauthjs/next-auth/blob/main/docs/pages/animated-stars.css
import './animated-stars.css'

const StarsBackground = () => {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen pointer-events-none opacity-80">
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
      <div id="stars4"></div>
    </div>
  )
}

export default StarsBackground
