import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json'
import MiningSpinner from './MiningSpinner/MiningSpinner';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [waveCount, setWaveCount] = useState('0')
  const [allWaves, setAllWaves] = useState([]);
  const [message, setMessage] = useState('')
  const [showLoader, setShowLoader] = useState(false)

  const contractAddress = "0x120D4D73117068a6dB21B3f13D9a4Ab2fa098aCf";

  const contractABI = abi.abi;
  
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        getAllWaves();
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      getAllWaves();
    } catch (error) {
      console.log(error)
    }
  }

const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        // setWaveCount(count.toNumber())

        /*
        * Execute the actual wave from your smart contract
        */
        // const waveTxn = await wavePortalContract.wave();
        const waveTxn = await wavePortalContract.wave(message, { gasLimit: 300000 })
        console.log("Mining...", waveTxn.hash);
        setShowLoader(true)

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);
        setShowLoader(false)

        count = await wavePortalContract.getTotalWaves();
        setWaveCount(count.toNumber());
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }


 const sortWaves = (allWaves) => {
    const updatedWaves = allWaves.sort((a, b) => b.timestamp - a.timestamp)
    setAllWaves(updatedWaves)
 }
 /*
   * Create a method that gets all waves from your contract
   */
 const getAllWaves = async () => {
    const { ethereum } = window;

    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const waves = await wavePortalContract.getAllWaves();

        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        sortWaves(wavesCleaned);

        /**
         * Listen in for emitter events!
         */
        wavePortalContract.on("NewWave", (from, timestamp, message) => {
          console.log("NewWave", from, timestamp, message);

          setAllWaves(prevState => [{
            address: from,
            timestamp: new Date(timestamp * 1000),
            message: message
          }, ...prevState]);

          console.log('new waves:', allWaves)
        });


      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])
  
  return (
    <>
      <div className="bg-white py-16 sm:py-24">
            <div className="relative sm:py-16">
              <div aria-hidden="true" className="hidden sm:block">
                <div className="absolute inset-y-0 left-0 w-1/2 bg-gray-50 rounded-r-3xl" />
                <svg className="absolute top-8 left-1/2 -ml-3" width={404} height={392} fill="none" viewBox="0 0 404 392">
                  <defs>
                    <pattern
                      id="8228f071-bcee-4ec8-905a-2a059a2cc4fb"
                      x={0}
                      y={0}
                      width={20}
                      height={20}
                      patternUnits="userSpaceOnUse"
                    >
                      <rect x={0} y={0} width={4} height={4} className="text-gray-200" fill="currentColor" />
                    </pattern>
                  </defs>
                  <rect width={404} height={392} fill="url(#8228f071-bcee-4ec8-905a-2a059a2cc4fb)" />
                </svg>
              </div>
              <div className="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
                <div className="relative rounded-2xl px-6 py-10 bg-gray-500 overflow-hidden shadow-xl sm:px-12 sm:py-20">
                  <div aria-hidden="true" className="absolute inset-0 -mt-72 sm:-mt-32 md:mt-0">
                    <svg
                      className="absolute inset-0 h-full w-full"
                      preserveAspectRatio="xMidYMid slice"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 1463 360"
                    >
                      <path
                        className="text-indigo-500 text-opacity-40"
                        fill="currentColor"
                        d="M-82.673 72l1761.849 472.086-134.327 501.315-1761.85-472.086z"
                      />
                      <path
                        className="text-indigo-700 text-opacity-40"
                        fill="currentColor"
                        d="M-217.088 544.086L1544.761 72l134.327 501.316-1761.849 472.086z"
                      />
                    </svg>
                  </div>
                  <div className="relative">
                    <div className="sm:text-center">
                      <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                        👋 Hey there!
                      </h2>
                      <p className="mt-6 mx-auto max-w-2xl text-lg text-white">
                        I'm Kevin. I spend my weekends working on web3 projects.
                      </p>
                      <p className="mt-2 mx-auto max-w-2xl text-lg text-white">
                        Connect your Ethereum wallet and say hi!
                      </p>
                      {showLoader && <MiningSpinner />}
                      <p className="mt-2 mx-auto max-w-2xl text-lg text-indigo-200">
                      {waveCount !== '0' && 
                        'Thank you! You are message #' + waveCount + '.'
                      }
                      </p>
                      <p className="min-w-0 flex-1">
                        {!currentAccount && (
                          <button 
                            className="block w-full rounded-md border border-transparent px-5 py-3 bg-indigo-500 text-base font-medium text-white shadow hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 sm:px-10" 
                            onClick={connectWallet}
                          >
                            Connect Wallet
                          </button>
                        )}
                      </p>
                    </div>
                    {currentAccount && (
                    <div className="mt-12 sm:mx-auto sm:max-w-lg sm:flex">
                      <div className="min-w-0 flex-1">
                        <input
                          id="message"
                          type="text"
                          className="block w-full border border-transparent rounded-md px-5 py-3 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
                          placeholder="Enter your message of support"
                          onChange={e => setMessage(e.target.value)}
                        />
                      </div>
                      <div className="mt-4 sm:mt-0 sm:ml-3">
                        <button
                          type="submit"
                          className="block w-full rounded-md border border-transparent px-5 py-3 bg-indigo-500 text-base font-medium text-white shadow hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 sm:px-10"
                          onClick={wave}
                        >
                          Submit message
                        </button>
                      </div>
                    </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {currentAccount && (
          <div className="container mx-auto">
            <div className="flex flex-col">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Address
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Time
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Message
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {allWaves.map((wave, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{wave.address}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{wave.timestamp.toString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{wave.message}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}
    </>
  );
}

export default App