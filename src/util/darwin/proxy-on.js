
const proxyOnDarwin = `IFS=$'\n'
for nport in $(networksetup -listallnetworkservices | tail +2 );
do

networksetup -setproxyautodiscovery $nport on
networksetup -setautoproxystate $nport on
networksetup -setwebproxystate $nport on
networksetup -setsecurewebproxystate $nport on
networksetup -setftpproxystate $nport on
networksetup -setsocksfirewallproxystate $nport on
networksetup -setstreamingproxystate $nport on

done`
