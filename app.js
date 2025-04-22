import{BrowserProvider,Contract} from "https://cdn.jsdelivr.net/npm/ethers@6.8.1/+esm";

    const contractAddress = "0x0AF2c637EcAF3487BE022c22496dAf88C9e47a86";
    const abi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "message",
				"type": "string"
			}
		],
		"name": "FeedbackSubmitted",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "feedbacks",
		"outputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "message",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getFeedback",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTotalFeedback",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_msg",
				"type": "string"
			}
		],
		"name": "submitFeedback",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

    let contract;
    let provider;
    let signer;

	const walletaddress = document.getElementById("walletaddress");

	const readProvider = new BrowserProvider(window.ethereum);
	const readContract = new Contract(contractAddress, abi, await readProvider.getSigner());

	window.onload = () => {
	readContract.getTotalFeedback()
    .then(() => displayFeedbacks())
    .catch(() => console.log("Wallet not connected, skipping display"));
 };


    document.getElementById("connect").onclick = async () => {

    	provider = new BrowserProvider(window.ethereum);
    	signer = await provider.getSigner()

		const currentAddress = await signer.getAddress();

		walletaddress.textContent = currentAddress;
	
      	contract = new Contract(contractAddress,abi,signer);

      	alert("Wallet Connected");

      	contract.on("FeedbackSubmitted", async (sender, message) => {
  		const currentAddress = await signer.getAddress();
  			if (sender.toLowerCase() !== currentAddress.toLowerCase()) {
  			alert(`New feedback from ${sender}: ${message}`);
  		}

  	displayFeedbacks();
	});

      
      displayFeedbacks();

    }

    document.getElementById("submitBtn").onclick = async () => {
		if (!contract) return alert("Please connect your wallet first.");
		const msg = document.getElementById("feedbackInput").value;
		if(!msg) return alert("Please enter a message");
		try{
		  const tx = await contract.submitFeedback(msg);
		  await tx.wait();
		  document.getElementById("feedbackInput").value = "";
		  alert("Feedback Submitted");
		}
		catch(error){
		  console.log(error);
		  alert("Transaction Failed");
		}
    }

    async function displayFeedbacks() {

      const container = document.getElementById("allFeedbacks");
      container.innerHTML = ""

      try{
        const total = await contract.getTotalFeedback();
        for(let i = 0; i < total ; i++)
        {
          const [sender,message] = await contract.getFeedback(i);
          
          const div = document.createElement("div");
          div.className = "feedbackItem";
          div.innerHTML = `<strong>${sender}:</strong>${message}`;

          container.appendChild(div);
        }
      }
      catch(error){
        console.error("Error Fetching feedbacks",error);
      }
    }
