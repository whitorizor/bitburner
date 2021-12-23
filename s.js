/** @param {NS} ns **/
export async function main(ns) {
	//purchase all available servers
	//infra.script: 1 GB 55000

	// SETUP 
	let res = null;
	let hostnamePrefix = "s";
	let maxPlayerServers = ns.getPurchasedServerLimit();
	let gbRamCost = 55000;
	let minGbRam = 256;
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

		ns.tprint("SETUP INFO");
		ns.tprint("-----------------------------------");
		ns.tprint("Current Servers: ", purchasedServers, " | ", maxPlayerServers);
		ns.tprint("Current RAM: ", currentRAM);
		ns.tprint("RAM Target: ", minGbRam);
		ns.tprint("MaxRam:     ", maxGbRam);
		ns.tprint("Hscript Mem: ", hscriptMemory);
		ns.tprint("Threads Max: ", maxThreads);
		ns.tprint("Server Price:        ", Math.round(minGbRam * gbRamCost / 1000000), "M");
		ns.tprint("Server Money Needed: ", Math.round(serverMoneyNeeded / 1000000), "M");
		ns.tprint("Money Available:     ", Math.round(availableMoney / 1000000), "M");
		ns.tprint("-----------------------------------");

		await ns.sleep(5000);

		if (currentRAM < minGbRam) {

			while (serverMoneyNeeded > availableMoney) {
				myMoney();
				ns.tprint("ServerPurchase Status: [ ", serverMoneyNeeded / 1000000, "M | ", Math.round(availableMoney / 1000000), "M ]");
				await ns.sleep(10000);
			}

			//Deploy all purchasable SERVERS
			if (serverMoneyNeeded < availableMoney) {
				ns.tprint("++ Buying/Upgrading servers...");
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
								ns.tprint("++ Acquired [", res, "] - [", minGbRam, "]")
							} else {
								ns.tprint("!! Error buying server: ", fullName, " [", minGbRam, "]")
							}
							// COPYING HSCRIPT
							res = await ns.scp("h.js", fullName);
							if (res) {
								ns.tprint(res, " ++ h.js transferred..")
							} else {
								ns.tprint(res, " !! ERROR with h.script transferring..")
							}

							// RUNNING HSCRIPT with MAX THREADS
							res = ns.exec("h.js", fullName, maxThreads);
							if (res == 0) {
								ns.tprint(res, " !! ERROR starting hscript on: ", fullName, "with ", maxThreads);
							} else {
								ns.tprint(res, " ++ Hscript started on: ", fullName, "with ", maxThreads);
							}
						} else {
							ns.tprint("++ ", fullName, " already upgraded. SKIPPING.");
						}
					} else {
						// PURCHASING SERVER
						res = ns.purchaseServer(fullName, minGbRam);
						if (res) {
							ns.tprint("++ Acquired [", res, "] - [", minGbRam, "]")
						} else {
							ns.tprint("!! Error buying server: ", fullName, " [", minGbRam, "]")
						}

						// COPYING HSCRIPT
						res = await ns.scp("h.js", fullName);
						if (res) {
							ns.tprint(res, " ++ h.js transferred..")
						} else {
							ns.tprint(res, " !! ERROR with h.script transferring..")
						}

						// RUNNING HSCRIPT with MAX THREADS
						res = ns.exec("h.js", fullName, maxThreads);
						if (res == 0) {
							ns.tprint(res, " !! ERROR starting hscript on: ", fullName, "with ", maxThreads);
						} else {
							ns.tprint(res, " ++ Hscript started on: ", fullName, "with ", maxThreads);
						}
					}
				}
			} else {
				ns.tprint("!! Not enough $$ to buy/upgrade servers. [ ", serverMoneyNeeded / 1000000, "M | ", Math.round(availableMoney / 1000000), "M ]");
			}

		} else {
			ns.tprint("++ run with [", minGbRam, "] already completed. INCREASING.")
		}


		minGbRam = (minGbRam * 16);
		ns.tprint("++ Increasing minGbRAM size to ", minGbRam, " restarting to upgrade in 10s.");

		await ns.sleep(1000);
	}
	ns.tprint("++ Servers upgraded to maximum!");
}