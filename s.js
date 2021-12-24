/** @param {NS} ns **/
export async function main(ns) {
	//purchase all available servers
	// 1 GB 	  55k
	//16 GB		 880k
	//32 GB		1760k
	//64 GB		3520k

	// SETUP 
	let res = null;
	let hostnamePrefix = "s";
	let maxPlayerServers = ns.getPurchasedServerLimit();
	let gbRamCost = 55000;
	let minGbRam = 16;
	let maxGbRam = ns.getPurchasedServerMaxRam();
	let currentRAM = 0;
	let purchasedServers = ns.getPurchasedServers();
	let serverMoneyNeeded = minGbRam * gbRamCost * maxPlayerServers;
	let availableMoney = ns.getServerMoneyAvailable("home");
	let hscriptMemory = ns.getScriptRam("h.js", "home");
	let maxThreads = Math.round((minGbRam / hscriptMemory) - 0.5);

	if (ns.serverExists("s25")) {
		currentRAM = ns.getServerMaxRam("s25");
		ns.getserver
	}

	function log() {
		var logtime = new Date();
		return "[" + logtime.getHours() + ":" + logtime.getMinutes() + ":" +  logtime.getSeconds() + "]"
	}


	function myMaxThreads() {
		maxThreads = Math.round((minGbRam / hscriptMemory) - 0.5);
		return maxThreads;
	}

	function myMoney() {
		availableMoney = ns.getServerMoneyAvailable("home");
		return availableMoney;
	}

	function myHscriptMemory() {
		hscriptMemory = ns.getScriptRam("h.js", "home");
		return hscriptMemory;
	}

	function myPurchasedServers() {
		purchasedServers = ns.getPurchasedServers();
		return purchasedServers;
	}

	function myMoneyNeeded() {
		serverMoneyNeeded = minGbRam * gbRamCost * maxPlayerServers;
		return serverMoneyNeeded;
	}

	function myKillScript(script, server) {
		return ns.scriptKill(script, server);
	}

	function myPurchaseServer(server, ram) {
		return ns.purchaseServer(server, ram);
	}



	while (minGbRam <= maxGbRam) {

		//refreshing SETUP
		myMaxThreads();
		myHscriptMemory();
		myPurchasedServers();
		myMoneyNeeded();

		ns.tprint(log(), " SETUP INFO");
		ns.tprint(log(), " -----------------------------------");
		ns.tprint(log(), " Current Servers: ", purchasedServers, " | ", maxPlayerServers);
		ns.tprint(log(), " Current RAM: ", currentRAM);
		ns.tprint(log(), " RAM Target: ", minGbRam);
		ns.tprint(log(), " MaxRam:     ", maxGbRam);
		ns.tprint(log(), " Hscript Mem: ", hscriptMemory);
		ns.tprint(log(), " Threads Max: ", maxThreads);
		ns.tprint(log(), " Server Price:        ", Math.round(minGbRam * gbRamCost / 1000000), "M");
		ns.tprint(log(), " Server Money Needed: ", Math.round(serverMoneyNeeded / 1000000), "M");
		ns.tprint(log(), " Money Available:     ", Math.round(availableMoney / 1000000), "M");
		ns.tprint(log(), " -----------------------------------");

		await ns.sleep(5000);

		if (currentRAM < minGbRam) {

			while (serverMoneyNeeded > availableMoney) {
				myMoney();
				ns.tprint(log(), " ServerPurchase Status: [ ", serverMoneyNeeded / 1000000, "M | ", Math.round(availableMoney / 1000000), "M ]");
				await ns.sleep(10000);
			}

			//Deploy all purchasable SERVERS
			if (serverMoneyNeeded < availableMoney) {
				ns.tprint(log(), " ++ Buying/Upgrading servers...");
				for (let z = 1; z <= maxPlayerServers; z++) {
					let fullName = hostnamePrefix + z


					if (ns.serverExists(fullName)) {
						if (ns.getServerMaxRam(fullName) < minGbRam) {

							// KILL SCRIPT
							ns.scriptKill("h.js", fullName);

							// DELETE OLD SERVER
							ns.deleteServer(fullName);

							// PURCHASING SERVER
							res = ns.purchaseServer(fullName, minGbRam);
							if (res) {
								ns.tprint(log(), " ++ Acquired [", res, "] - [", minGbRam, "]")
							} else {
								ns.tprint(log(), " !! Error buying server: ", fullName, " [", minGbRam, "]")
							}
							// COPYING HSCRIPT
							res = await ns.scp("h.js", fullName);
							if (res) {
								ns.tprint(log(), " ", res, " ++ h.js transferred..")
							} else {
								ns.tprint(log(), " ", res, " !! ERROR with h.script transferring..")
							}

							// RUNNING HSCRIPT with MAX THREADS
							res = ns.exec("h.js", fullName, maxThreads);
							if (res == 0) {
								ns.tprint(log(), " ", res, " !! ERROR starting hscript on: ", fullName, "with ", maxThreads);
							} else {
								ns.tprint(log(), " ", res, " ++ Hscript started on: ", fullName, "with ", maxThreads);
							}
						} else {
							ns.tprint(log(), " ++ ", fullName, " already upgraded. SKIPPING.");
						}
					} else {
						// PURCHASING SERVER
						res = ns.purchaseServer(fullName, minGbRam);
						if (res) {
							ns.tprint(log(), " ++ Acquired [", res, "] - [", minGbRam, "]")
						} else {
							ns.tprint(log(), " !! Error buying server: ", fullName, " [", minGbRam, "]")
						}

						// COPYING HSCRIPT
						res = await ns.scp("h.js", fullName);
						if (res) {
							ns.tprint(log(), " ", res, " ++ h.js transferred..")
						} else {
							ns.tprint(log(), " ", res, " !! ERROR with h.script transferring..")
						}

						// RUNNING HSCRIPT with MAX THREADS
						res = ns.exec("h.js", fullName, maxThreads);
						if (res == 0) {
							ns.tprint(log(), " ", res, " !! ERROR starting hscript on: ", fullName, "with ", maxThreads);
						} else {
							ns.tprint(log(), " ", res, " ++ Hscript started on: ", fullName, "with ", maxThreads);
						}
					}
				}
			} else {
				ns.tprint(log(), " !! Not enough $$ to buy/upgrade servers. [ ", serverMoneyNeeded / 1000000, "M | ", Math.round(availableMoney / 1000000), "M ]");
			}

		} else {
			ns.tprint(log(), " ++ run with [", minGbRam, "] already completed. INCREASING.")
		}


		minGbRam = (minGbRam * 16);
		ns.tprint(log(), " ++ Increasing minGbRAM size to ", minGbRam, " restarting to upgrade in 10s.");

		await ns.sleep(1000);
	}
	ns.tprint(log(), " ++ Servers upgraded to maximum!");
}