import React, { useState, useEffect } from "react";
import Admin from "./admin";

const Login = ({vanta, custom}) => {
  const [isVerified, setIsVerified] = useState(false);
  const [password, setPassword] = useState("");
  const vantaRef = React.useRef(null);

  useEffect(() => {
    const initializeVanta = () => {
      console.log('Initializing Vanta effect');
      const loadVanta = () => {
        if (window.VANTA) {
          window.VANTA.FOG({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            highlightColor: vanta[0],
            midtoneColor: vanta[1],
            lowlightColor: vanta[2],
          });
        }
      };
      if (vantaRef.current) {
        if (window.VANTA) {
          loadVanta();
        } else {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.fog.min.js';
          script.onload = loadVanta;
          document.body.appendChild(script);
        }
      }
    };
    initializeVanta();
  }, [vanta]);

  const checkPw = () => {
    if (password === process.env.REACT_APP_ADMIN_PASSWORD) {
      setIsVerified(true);
    } else {
      alert("Sorry, that's not it");
    }
  };

  return (
    <>
      
      {isVerified ? <Admin custom={custom}/> : (
        <>
          <div ref={vantaRef} className="absolute flex flex-col items-center justify-center min-h-screen w-full h-full -z-50"></div>
          <form>
          <div className="flex flex-col items-center justify-center min-h-screen w-full h-full z-10">
            <div className="flow-root max-w-[85%] bg-gray-900 bg-opacity-50 rounded-lg p-6 w-full max-w-3xl">
              <div className="mb-3">
                <label className="block text-gray-300 font-semibold mb-2">Password</label>
                <input
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="mt-auto flex justify-center">
                <button
                  onClick={checkPw} // Pass the function reference, not an immediate call
                  className="bg-gray-400 hover:bg-pink-500 text-white font-semibold py-2 px-4 rounded-lg text-lg transition duration-300 
                  md:text-xl md:py-3 md:px-5"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
          </form>
        </>
      )}
    </>
  );
};

export default Login;
