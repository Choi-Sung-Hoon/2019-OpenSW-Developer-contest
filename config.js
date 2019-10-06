module.exports = {
	server_port: 3000,
	db_url: 'mongodb://localhost:27017/local',
	db_schemas: [
	    {file:'./user_schema', collection:'users5', schemaName:'UserSchema', modelName:'UserModel'}
	],
	route_info: [
		    //===== User =====//
			{file:'./user', path:'/listRecord_uv', method:'listRecord_uv', type:'post'}	
	]
}