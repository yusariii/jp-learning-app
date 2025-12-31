const PATH_AUTH ="/auth"
const PATH_ADMIN ="/admin"
const PATH_CLIENT ="/client"
const PATH_API ="/api"
const PATH_CONTENT ="/content"
const PATH_SYSTEM ="/system"


module.exports = {
    prefixAdminContent: PATH_API + PATH_ADMIN + PATH_CONTENT,
    prefixAdminAPI: PATH_API + PATH_ADMIN,
    prefixClientAPI: PATH_API + PATH_CLIENT,
    prefixSystem: PATH_API + PATH_ADMIN + PATH_SYSTEM,

}