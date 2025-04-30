The backend will return an id, which would correspond to a specific error / return message in a given context.

# 0000 : General
Code | Error
---  | ---  
0500 | Generic internal server error
0400 | Missing argument
0413 | Argument is too long
0403 | User not logged in


# 0001 : Auth

## Register

Code | Error
--   | --
1001 | Password must contain lowercase letters, uppercase letters, and digits
1002 | Password is too short
1003 | User already exists
1004 | Invalid email format (regex)
1005 | Invalid username format (regex)
1007 | Please specify an email
1008 | Please specify a name
1009 | Please specify a password


## Login

Code | Error
--   | --
1006 | Invalid username or password
1013 | User is banned
1014 | Account was created using an external provider
1018 | Already logged in
1016 | Invalid token provided

##  2Fa

Code | Error
--   | --
1015 | Failed to log in with Google
1017 | Invalid code
1020 | User not logged in with 2fa

# 2000: User

## isBlockedBy
Code | Error
--   | --
2001 | target do not exist
2002 | by do not exist

## BlockUser

Code | Error
---  | ---    
2011 | User is yourself
2012 | User doesn't exists
2013 | User is admin

# 3000: Chat

## msg 
| Code | Error
| --   | --
| 3001 | target blocked you