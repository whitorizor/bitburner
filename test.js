/** @param {NS} ns **/

export async function main(ns) {
	// log settings

	function log() {
		var logtime = new Date();
		return "[" + logtime.getDate() + " - " + logtime.getHours() + ":" + logtime.getMinutes() + ":" +  logtime.getSeconds() + "]"
	}

	ns.tprint(log());
}