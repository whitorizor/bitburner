/** @param {NS} ns **/
export async function main(ns) {
	let target = ns.getHostname();
	let memfree = 10;
	let scriptToCheck = "h.js";
	if (ns.args[0]) {
		scriptToCheck = ns.args[0];
		if (ns.args[1]) {
			memfree = ns.args[1]
		}
		};
	ns.tprint ("[",scriptToCheck, "] can be run with [",(ns.getServerMaxRam(target)-memfree)/ns.getScriptRam(scriptToCheck) ,"] threads and freeMem of [", memfree, "] ", );
}