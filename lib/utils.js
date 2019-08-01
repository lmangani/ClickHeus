/* PCAP Header */ 
const sharedStructs = require('shared-structs'); 
const structs = sharedStructs(`
      struct pcap {
                  uint64_t ts_sec;
                  uint64_t ts_usec;
                  uint64_t incl_len;
                  uint64_t orig_len;
      }
`);
module.exports.structs = structs;

var getLinkType = function(LinkType) {
	switch (LinkType) {
            case "LINKTYPE_ETHERNET":
                LinkType = 1;
                break;
            case "LINKTYPE_NULL":
                LinkType = 0;
                 break;
            case "LINKTYPE_RAW":
                LinkType = 101;
                break;
            case "LINKTYPE_IEEE802_11_RADIO":
                LinkType = 127;
                break;
            case "LINKTYPE_LINUX_SLL":
                LinkType = 113;
            default:
                console.log("Datalink type not supported");
            }
	return LinkType;
}
module.exports.getLinkType = getLinkType;


var getHeader = function(packet){
	// Build PCAP Hdr Struct
            var newHdr = structs.pcap();
            newHdr.ts_sec = packet.pcap_header.tv_sec;
            newHdr.ts_usec = packet.pcap_header.tv_usec;
            newHdr.incl_len = packet.pcap_header.caplen;
            newHdr.orig_len = packet.pcap_header.len;
	return newHdr;
}
module.exports.getHeader = getHeader;
