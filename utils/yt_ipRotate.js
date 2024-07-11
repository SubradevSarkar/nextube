// import ytdl from "ytdl-core";
import ytdl from "@distube/ytdl-core";
import { getRandomIPv6 } from "@distube/ytdl-core/lib/utils";

export const agentForARandomIP = ytdl.createAgent(undefined, {
  localAddress: getRandomIPv6("2001:2::/48"),
});
