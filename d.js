/** @param {NS} ns **/
export async function main(ns) {

	function discoverTargets() {
		let targets = [];
		//let blacklist = ["home", "s1", "s2,", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "s11", "s12", "s13", "s14", "s15", "s16", "s17", "s18", "s19", "s20", "s21", "s22", "s23", "s24", "s25"];
		let stack = [];
		let origin = ns.getHostname();
		let node = null;
		let nextNodes = null;

		stack.push(origin);

		while (stack.length > 0) {
			node = stack.pop();
			if (targets.includes(node)) {
				//Do nothing => "continue"
			} else {
				targets.push(node);
				ns.print("++ added: ", node);
				nextNodes = ns.scan(node);
				ns.print(":: scanning: ", node);
				for (let i = 0; i < nextNodes.length; ++i) {
					stack.push(nextNodes[i]);
				}
			}
		}
		return targets;
	}

	// deploy and gain root
	let deployServers = discoverTargets();
	// remove home server
	deployServers = deployServers.filter(f => f !== "home");
	
	let server = null;
	let myScript = "h.js";

	if (ns.args[0]) {
		myScript = ns.args[0];
	}

	let hScriptMemUsage = ns.getScriptRam(myScript, "home");
	ns.tprint("Current RAM usage of h.script: ", hScriptMemUsage);


	// GAIN ROOT
	for (let i = 0; i < deployServers.length; ++i) {
		server = deployServers[i];

		ns.tprint("---------------------- [", server, "] ----------------------");
		if (ns.serverExists(server)) {

			if (!ns.hasRootAccess(server)) {
				ns.tprint("++ Gaining ROOT: ", server);
				if (ns.getServerNumPortsRequired(server) == 0) {
					ns.tprint("++ RequiredPorts 0, nuking...", server);
					ns.nuke(server);
				}

				if (ns.getServerNumPortsRequired(server) == 1) {
					ns.tprint("++ RequiredPorts = 1, nuking... ", server);
					if (ns.fileExists("BruteSSH.exe", "home")) {
						ns.brutessh(server);
						ns.nuke(server);
					} else {
						ns.tprint("-- MISSING EXE[1].");
					}
				}

				if (ns.getServerNumPortsRequired(server) == 2) {
					ns.tprint("++ RequiredPorts = 2, nuking... ", server);
					if (ns.fileExists("BruteSSH.exe", "home") &&
						ns.fileExists("FTPCrack.exe", "home")) {
						ns.brutessh(server);
						ns.ftpcrack(server);
						ns.nuke(server);
					} else {
						ns.tprint("-- MISSING EXE[2].");
					}
				}

				if (ns.getServerNumPortsRequired(server) == 3) {
					ns.tprint("++ RequiredPorts = 3, nuking...", server);
					if (ns.fileExists("BruteSSH.exe", "home") &&
						ns.fileExists("FTPCrack.exe", "home") &&
						ns.fileExists("relaySMTP.exe", "home")) {
						ns.brutessh(server);
						ns.ftpcrack(server);
						ns.relaysmtp(server);
						ns.nuke(server);
					} else {
						ns.tprint("-- MISSING EXE[3].");
					}
				}

				if (ns.getServerNumPortsRequired(server) == 4) {
					ns.tprint("++ RequiredPorts = 4, nuking...", server);
					if (ns.fileExists("BruteSSH.exe", "home") &&
						ns.fileExists("FTPCrack.exe", "home") &&
						ns.fileExists("relaySMTP.exe", "home") &&
						ns.fileExists("HTTPWorm.exe", "home")
					) {
						ns.brutessh(server);
						ns.ftpcrack(server);
						ns.relaysmtp(server);
						ns.httpworm(server);
						ns.nuke(server);
					} else {
						ns.tprint("-- MISSING EXE[4].");
					}
				}

				if (ns.getServerNumPortsRequired(server) == 5) {
					ns.tprint("++ RequiredPorts = 5, nuking...", server);
					if (ns.fileExists("BruteSSH.exe", "home") &&
						ns.fileExists("FTPCrack.exe", "home") &&
						ns.fileExists("relaySMTP.exe", "home") &&
						ns.fileExists("HTTPWorm.exe", "home") &&
						ns.fileExists("SQLInject.exe", "home")
					) {
						ns.brutessh(server);
						ns.ftpcrack(server);
						ns.relaysmtp(server);
						ns.httpworm(server);
						ns.sqlinject(server);
						ns.nuke(server);
					} else {
						ns.tprint("-- MISSING EXE[5].");
					}
				}


			} else {
				ns.tprint("Root [OK]");
			}

			// copy executing script
			await ns.scp(myScript, server);

			let res = ns.killall(server);
			ns.print("Killingresult: ", res);

			if (ns.getServerMaxRam(server) < hScriptMemUsage) {
				ns.tprint("-- Not enough RAM to run h.js.");
			} else {
				if (ns.hasRootAccess(server)) {
					let threads = (ns.getServerMaxRam(server) / hScriptMemUsage) - 0.5;
					ns.exec(myScript, server, threads);
					ns.tprint("++ HACKING with [", myScript , "] on [", server, "] with -t ", Math.round(threads));
				} else {
					ns.tprint("-- NO Root.");
				}
			}
		} else {
			ns.tprint("!! [", server, "] not found.");
		}
	}
}