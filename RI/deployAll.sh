# 
# This file is part of SUNFISH Registry Interface.
# 
# SUNFISH Registry Interface is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
# 
# SUNFISH Registry Interface is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
# 
# You should have received a copy of the GNU General Public License along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
# 

# Author: Md Sadek Ferdous

#!/bin/bash
docker run --name memcached -d --restart=always --publish 11211:11211 sameersbn/memcached:latest;node deployAccess.js; node deployAlert.js; node deployAnon.js; node deployDMKey.js;node deployFed.js;node deployPolicy.js;node deploySLA.js;node deployState.js;