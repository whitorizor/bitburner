/** @param {NS} ns **/
export async function main(ns) {
    const args = ns.flags([["help", false]]);
    if (args.help) {
        ns.tprint("This script will enhance your HUD (Heads up Display) with custom statistics.");
        ns.tprint(`Usage: run ${ns.getScriptName()}`);
        ns.tprint("Example:");
        ns.tprint(`> run ${ns.getScriptName()}`);
        return;
    }

    let serverRam = 0;
    let hacknetProd = 0;
    const doc = document; // This is expensive! (25GB RAM) Perhaps there's a way around it? ;)
    const hook0 = doc.getElementById('overview-extra-hook-0');
    const hook1 = doc.getElementById('overview-extra-hook-1');
    while (true) {
        try {
            const headers = []
            const values = [];
            // Add script income per second
            headers.push("$");
            values.push((ns.getScriptIncome()[1] / 1000000000).toFixed(6) + ' B/sec');

            // Add script exp gain rate per second
            headers.push("XP");
            values.push((ns.getScriptExpGain() / 1000000).toFixed(6) + ' M/sec');

            // Add purchased Servers stats
            if (ns.getPurchasedServers().length > 0) {
                serverRam = ns.getServerMaxRam("s1") / 1024;
            }
            headers.push("Servers ("+ ns.getPurchasedServers().length +")");
            values.push(serverRam.toFixed(3) + " TB");

            // hacknet stats
            if (ns.hacknet.numNodes() > 0) {
                for (let i = 0; i < ns.hacknet.numNodes(); ++i) {
                    hacknetProd = hacknetProd + ns.hacknet.getNodeStats(i).production
                }
            }
            headers.push("HackNet ("+ns.hacknet.numNodes() +")");
            values.push((hacknetProd/1000000).toFixed(3) + ' M/sec');
            hacknetProd = 0;



            //ns.tprint ("CrimeStats: ", ns.getPlayer());

            // TODO: Add more neat stuff



            // Now drop it into the placeholder elements
            hook0.innerText = headers.join(" \n");
            hook1.innerText = values.join("\n");
        } catch (err) { // This might come in handy later
            ns.print("ERROR: Update Skipped: " + String(err));
        }
        await ns.sleep(1000);
    }
}