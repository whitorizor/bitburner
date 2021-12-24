/** @param {NS} ns **/

export async function main(ns) {
	// log settings
	ns.disableLog("ALL");

	//let foundnodes = ["n00dles", "foodnstuff", "zer0", "sigma-cosmetics", "nectar-net", "joesguns", "max-hardware", "hong-fang-tea", "CSEC", "harakiri-sushi", "silver-helix", "comptek", "neo-net", "the-hub", "iron-gym", "phantasy", "avmnite-02h", "rothman-uni", "johnson-ortho", "zb-institute", "millenium-fitness", "alpha-ent", "galactic-cyber", "omega-net", "crush-fitness", "I.I.I.I", "rho-construction", "netlink", "catalyst", "syscore", "aevum-police", "snap-fitness", "omnia", "zeus-med", "univ-energy", "aerocorp", "unitalife", "defcomm", "nova-med", "infocomm", "microdyne", "stormtech", "4sigma", "nwo", "ecorp", "summit-uni", "lexo-corp", "global-pharm", "deltaone", "solaris", "zb-def", "applied-energetics", "vitalife", ".", "powerhouse-fitness", "b-and-a", "fulcrumassets", "helios", "omnitek", "blade", "The-Cave", "megacorp", "fulcrumtech", "kuai-gong", "clarkinc", "icarus", "taiyang-digital", "run4theh111z", "titan-labs"]

	// DISCOVER ALL Targets and sanitize with blacklist
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
				ns.print(log(), " ++ added: ", node);
				nextNodes = ns.scan(node);
				ns.print(log(), " :: scanning: ", node);
				for (let i = 0; i < nextNodes.length; ++i) {
					stack.push(nextNodes[i]);
				}
			}
		}
		return targets;
	}

	function log() {
		var logtime = new Date();
		return "[" + logtime.getHours() + ":" + logtime.getMinutes() + ":" +  logtime.getSeconds() + "]"
	}

	// RANDOMIZE server ARRAY to avoid DDOSing one target
	function shuffleArray(t) {
		let currentIndex = foundnodes.length;
		let randomIndex = null;

		while (currentIndex != 0) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;
			[t[currentIndex], t[randomIndex]] = [t[randomIndex], t[currentIndex]];
		}
		return t;
	}

	// init vars
	let startTimer = Math.round(Math.random(10000) * 10000);
	let foundnodes = [];

	let moneyMulti = 1;
	let securityStatic = 5;

	let hasRoot = null;

	let maxMoney = null;
	let availableMoney = null;
	let moneyThresh = null;
	let moneyPercentage = null;

	let serverSecurityLevel = null;
	let serverMinSecurityLevel = null;
	let securityThresh = null;

	let requiredHackLevel = null;
	let playerHackLevel = null;

	let myHackTime = null;
	let myWeakenTime = null;
	let myGrowTime = null;

	let res = null;

	//shuffle for randomized hacking
	foundnodes = discoverTargets();
	foundnodes = shuffleArray(foundnodes);

	ns.print(log(), " :: STARTING @ ", ns.getHostname(), " in ", startTimer, "ms");
	ns.print(log(), " :: (randomized) TARGETS: ", foundnodes);

	if (ns.args[0]) {
		foundnodes = [];
		foundnodes[0] = ns.args[0];
		ns.print(log(), " :: (OVERWRITE) SINGLE TARGET ATTACK: ", foundnodes);
	}


	await ns.sleep(startTimer);


	function gatherServerData(blob) {
		//calc & reset stats for current target server
		hasRoot = ns.hasRootAccess(blob);
		maxMoney = ns.getServerMaxMoney(blob);
		availableMoney = ns.getServerMoneyAvailable(blob);
		moneyThresh = ns.getServerMaxMoney(blob) * moneyMulti;
		moneyPercentage = ns.getServerMoneyAvailable(blob) / ns.getServerMaxMoney(blob);
		serverSecurityLevel = ns.getServerSecurityLevel(blob);
		serverMinSecurityLevel = ns.getServerMinSecurityLevel(blob);
		securityThresh = ns.getServerMinSecurityLevel(blob) + securityStatic;
		requiredHackLevel = ns.getServerRequiredHackingLevel(blob);
		playerHackLevel = ns.getHackingLevel();

		//for displying purposes only could be removed to save RAM
		myHackTime = Math.round(ns.getHackTime(blob) / 1000);
		myWeakenTime = Math.round(ns.getWeakenTime(blob) / 1000);
		myGrowTime = Math.round(ns.getGrowTime(blob) / 1000);
	};

	function printServerData(blob, blub) {
		//prints the current server metric
		ns.print(log(), " :: [", ns.getHostname(), "], => ", blob, "	[", requiredHackLevel, "] ",
			"	$ [ %:", moneyPercentage.toPrecision(2), " A:", (availableMoney / 1000000).toPrecision(5), "M M:", (maxMoney / 1000000).toPrecision(5), "M ] ",
			"	SEC [ T:", securityThresh.toPrecision(2), " L:", serverSecurityLevel.toPrecision(2), " M:", serverMinSecurityLevel.toPrecision(2), " ] ",
			"	Time [ W:", myWeakenTime, " G:", myGrowTime, " H:", myHackTime, " ]");
	}


	while (true) {
		for (let i = 0; i < foundnodes.length; ++i) {
			let server = foundnodes[i];
			res = 0;

			//calc & reset stats for current target server
			gatherServerData(server);

			if (maxMoney != 0) {
				if (hasRoot) {
					if ((requiredHackLevel <= playerHackLevel) && (serverSecurityLevel > securityThresh)) {
						printServerData(server);
						ns.print(log(), " ++ Weaken in:", myWeakenTime, "s");
						res = await ns.weaken(server);
						ns.print(log(), " :: Weaken Result: ", res);
						gatherServerData(server);
						printServerData(server);
					} else if ((requiredHackLevel <= playerHackLevel) && (availableMoney < moneyThresh)) {
						printServerData(server);
						ns.print(log(), " ++ Grow in: ", myGrowTime, "s");
						res = await ns.grow(server);
						ns.print(log(), " :: Grow Result: ", res);
						gatherServerData(server);
						printServerData(server);
					} else {
						if (requiredHackLevel <= playerHackLevel) {
							printServerData(server);
							ns.print(log(), " ++ H@cking in: ", myHackTime, "s")
							res = await ns.hack(server);
							ns.print(log(), " :: Hack Result: ", res / 1000000, "M");
							gatherServerData(server);
							printServerData(server);
						} else {
							ns.print(log(), " !! HackingLevel too low. [", playerHackLevel, " | ", requiredHackLevel, "]	", server);
						}
					}
				} else {
					ns.print(log(), " !! No ROOT - skipping [", server, "]");
				}
			} else {
				ns.print(log(), " !! No $$$ skipping [", server, "]");
			}
		}
		await ns.sleep(100);
		ns.print(log(), " :: loopend ::");
	}
}