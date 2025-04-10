function RegisterStashCallbacks()
	Callbacks:RegisterServerCallback("Stash:Server:Open", function(source, data, cb)
		if GlobalState[string.format("%s:Property", source)] ~= nil then
			local pid = GlobalState[string.format("%s:Property", source)]
			local invKey = string.format("%s-%s", 13, pid)
	
			_openInvs[invKey] = _openInvs[invKey] or {}
			if not _openInvs[invKey][source] then
				Inventory.Stash:Open(source, 13, pid)
				_openInvs[invKey][source] = true
				cb({ type = 13, owner = string.format("stash:%s", pid) })
			else
				cb(nil)
			end
		else
			cb(nil)
		end
	end)
	
	Callbacks:RegisterServerCallback("Shop:Server:Open", function(source, data, cb)
		local k = string.format("shop:%s", data.identifier)
		if shopLocations[k] ~= nil then
			local entId = shopLocations[k].entityId
			local invKey = string.format("%s-%s", entId, data.identifier)
	
			_openInvs[invKey] = _openInvs[invKey] or {}
			if not _openInvs[invKey][source] then
				Inventory:OpenSecondary(source, entId, ("shop:%s"):format(data.identifier))
				_openInvs[invKey][source] = true
				cb(entId)
			else
				cb(false)
			end
		else
			cb(false)
		end
	end)
	
	Callbacks:RegisterServerCallback("Inventory:Server:Open", function(source, data, cb)
		kprint("Received data in Inventory:Server:Open callback:")
		local inventoryKey = string.format("%s-%s", data.invType, data.owner)
		kprint("Inventory Key:", inventoryKey)
	
		_openInvs[inventoryKey] = _openInvs[inventoryKey] or {}
		if not _openInvs[inventoryKey][source] then
			kprint("Inventory not open. Checking permissions...")
			if entityPermCheck(source, data.invType) then
				kprint("Permission granted. Opening inventory...")
				Inventory:OpenSecondary(source, data.invType, data.owner, data.class or false, data.model or false)
				_openInvs[inventoryKey][source] = true
				cb(true)
			else
				kprint("Permission denied for opening the inventory.")
				cb(false)
			end
		else
			kprint("Inventory already open.")
			cb(false)
		end
	end)
	
end

function kprint(...)
	local args = {...}
	local messageToPrint = "[DEBUG] " .. table.concat(args, "   ")
	print(messageToPrint)
end
