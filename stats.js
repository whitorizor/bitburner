/** @param {NS} ns **/
export async function main(ns) {
	//display stats of servers
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

	let foundnodes = discoverTargets();
	let hackCheckLevel = null;

	if (ns.args[0]) {
		hackCheckLevel = (ns.args[0])
	} else {
		hackCheckLevel = ns.getHackingLevel();
	}

	for (var i = 0; i < foundnodes.length; ++i) {
		var server = foundnodes[i];
		if (hackCheckLevel >= ns.getServerRequiredHackingLevel(server)) {
			ns.tprint(
				ns.hasRootAccess(server), " [", ns.getServerRequiredHackingLevel(server), "]	",
				"	$: ", (Math.round(ns.getServerMoneyAvailable(server) / ns.getServerMaxMoney(server)*100))/100, "		AVAIL:	", Math.round(ns.getServerMoneyAvailable(server)/1000000),"M",
				"		SEC: ", (Math.round(ns.getServerSecurityLevel(server)*100))/100, " | min: ", ns.getServerMinSecurityLevel(server),
				"		H:", Math.round(ns.getHackTime(server) / 1000), "s W:", Math.round(ns.getWeakenTime(server) / 1000), "s G:", Math.round(ns.getGrowTime(server) / 1000), "s",
				"		",foundnodes[i]
			);
		}
	}
}