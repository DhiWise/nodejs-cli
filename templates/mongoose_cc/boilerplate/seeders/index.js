const db = require('mongoose');
const User = require('../model/user')(db);
const authConstant = require('../constants/authConstant');
const Role = require('../model/role')(db);
const ProjectRoute = require('../model/projectRoute')(db);
const RouteRole = require('../model/routeRole')(db);
const UserRole = require('../model/userRole')(db);
const { replaceAll } = require('../utils/common');

async function seedRole () {
  try {
    const roles = [ 'User', 'Admin', 'SYSTEM_USER' ];
    for (let i = 0; i < roles.length; i++) {
      let result = await Role.findOne({
        name: roles[i],
        isActive: true,
        isDeleted: false 
      });
      if (!result) {
        await Role.create({
          name: roles[i],
          code: roles[i].toUpperCase(),
          weight: 1
        });
      }
    };
    console.info('Role model seeded 🍺');
  } catch (error){
    console.log('Role seeder failed.');
  }
}
async function seedProjectRoutes (routes) {
  try {
    if (routes && routes.length) {
      for (let i = 0; i < routes.length; i++) {
        const routeMethods = routes[i].methods;
        for (let j = 0; j < routeMethods.length; j++) {
          const routeObj = {
            uri: routes[i].path.toLowerCase(),
            method: routeMethods[j],
            route_name: `${replaceAll((routes[i].path).toLowerCase().substring(1), '/', '_')}`,
            isActive: true, 
            isDeleted: false
          };
          if (routeObj.route_name){
            let result = await ProjectRoute.findOne(routeObj);
            if (!result) {
              await ProjectRoute.create(routeObj);
            }
          }
        }
      }
      console.info('ProjectRoute model seeded 🍺');
    }
  } catch (error){
    console.log('ProjectRoute seeder failed.');
  }
}
async function seedRouteRole () {
  try {
    const routeRoles = [ 
      {
        route: '/admin/user/create',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/user/create',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/user/create',
        role: 'SYSTEM_USER',
        method: 'POST' 
      },
      {
        route: '/admin/user/list',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/user/list',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/user/list',
        role: 'SYSTEM_USER',
        method: 'POST' 
      },
      {
        route: '/admin/user/aggregate',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/user/aggregate',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/user/aggregate',
        role: 'SYSTEM_USER',
        method: 'POST' 
      },
      {
        route: '/admin/user/:id',
        role: 'User',
        method: 'GET' 
      },
      {
        route: '/admin/user/:id',
        role: 'Admin',
        method: 'GET' 
      },
      {
        route: '/admin/user/:id',
        role: 'SYSTEM_USER',
        method: 'GET' 
      },
      {
        route: '/admin/user/count',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/user/count',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/user/count',
        role: 'SYSTEM_USER',
        method: 'POST' 
      },
      {
        route: '/admin/user/update/:id',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/user/update/:id',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/user/update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT' 
      },
      {
        route: '/admin/user/partial-update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/admin/user/partial-update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/user/partial-update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT'
      },
      {
        route: '/admin/user/softdelete/:id',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/user/softdelete/:id',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/user/softdelete/:id',
        role: 'SYSTEM_USER',
        method: 'PUT'
      },
      {
        route: '/admin/user/softdeletemany',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/user/softdeletemany',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/user/softdeletemany',
        role: 'SYSTEM_USER',
        method: 'PUT'
      },
      {
        route: '/admin/user/delete/:id',
        role: 'SYSTEM_USER',
        method: 'DELETE'
      },
      {
        route: '/admin/user/deletemany',
        role: 'SYSTEM_USER',
        method: 'DELETE'
      },
      {
        route: '/admin/user/addbulk',
        role: 'SYSTEM_USER',
        method: 'POST' 
      },
      {
        route: '/admin/user/updatebulk',
        role: 'SYSTEM_USER',
        method: 'PUT' 
      },
      {
        route: '/admin/usertokens/create',
        role: 'SYSTEM_USER',
        method: 'POST'
      },
      {
        route: '/admin/usertokens/list',
        role: 'SYSTEM_USER',
        method: 'POST'
      },
      {
        route: '/admin/usertokens/aggregate',
        role: 'SYSTEM_USER',
        method: 'POST'
      },
      {
        route: '/admin/usertokens/:id',
        role: 'SYSTEM_USER',
        method: 'GET' 
      },
      {
        route: '/admin/usertokens/count',
        role: 'SYSTEM_USER',
        method: 'POST'
      },
      {
        route: '/admin/usertokens/update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT'
      },
      {
        route: '/admin/usertokens/partial-update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT'
      },
      {
        route: '/admin/usertokens/softdelete/:id',
        role: 'SYSTEM_USER',
        method: 'PUT'
      },
      {
        route: '/admin/usertokens/softdeletemany',
        role: 'SYSTEM_USER',
        method: 'PUT'
      },
      {
        route: '/admin/usertokens/delete/:id',
        role: 'SYSTEM_USER',
        method: 'DELETE'
      },
      {
        route: '/admin/usertokens/deletemany',
        role: 'SYSTEM_USER',
        method: 'DELETE'
      },
      {
        route: '/admin/usertokens/addbulk',
        role: 'SYSTEM_USER',
        method: 'POST'
      },
      {
        route: '/admin/usertokens/updatebulk',
        role: 'SYSTEM_USER',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/user/create',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/user/create',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/user/create',
        role: 'SYSTEM_USER',
        method: 'POST'
      },
      {
        route: '/device/api/v1/user/list',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/user/list',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/user/list',
        role: 'SYSTEM_USER',
        method: 'POST'
      },
      {
        route: '/device/api/v1/user/aggregate',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/device/api/v1/user/aggregate',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/device/api/v1/user/aggregate',
        role: 'SYSTEM_USER',
        method: 'POST'
      },
      {
        route: '/device/api/v1/user/:id',
        role: 'User',
        method: 'GET' 
      },
      {
        route: '/device/api/v1/user/:id',
        role: 'Admin',
        method: 'GET' 
      },
      {
        route: '/device/api/v1/user/:id',
        role: 'SYSTEM_USER',
        method: 'GET'
      },
      {
        route: '/device/api/v1/user/count',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/user/count',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/device/api/v1/user/count',
        role: 'SYSTEM_USER',
        method: 'POST'
      },
      {
        route: '/device/api/v1/user/update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/user/update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/user/update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/user/partial-update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/user/partial-update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/user/partial-update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/user/softdelete/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/user/softdelete/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/user/softdelete/:id',
        role: 'SYSTEM_USER',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/user/softdeletemany',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/user/softdeletemany',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/user/softdeletemany',
        role: 'SYSTEM_USER',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/user/delete/:id',
        role: 'SYSTEM_USER',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/user/deletemany',
        role: 'SYSTEM_USER',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/user/addbulk',
        role: 'SYSTEM_USER',
        method: 'POST'
      },
      {
        route: '/device/api/v1/user/updatebulk',
        role: 'SYSTEM_USER',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/usertokens/create',
        role: 'SYSTEM_USER',
        method: 'POST'
      },
      {
        route: '/device/api/v1/usertokens/list',
        role: 'SYSTEM_USER',
        method: 'POST'
      },
      {
        route: '/device/api/v1/usertokens/aggregate',
        role: 'SYSTEM_USER',
        method: 'POST'
      },
      {
        route: '/device/api/v1/usertokens/:id',
        role: 'SYSTEM_USER',
        method: 'GET'
      },
      {
        route: '/device/api/v1/usertokens/count',
        role: 'SYSTEM_USER',
        method: 'POST'
      },
      {
        route: '/device/api/v1/usertokens/update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/usertokens/partial-update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/usertokens/softdelete/:id',
        role: 'SYSTEM_USER',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/usertokens/softdeletemany',
        role: 'SYSTEM_USER',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/usertokens/delete/:id',
        role: 'SYSTEM_USER',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/usertokens/deletemany',
        role: 'SYSTEM_USER',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/usertokens/addbulk',
        role: 'SYSTEM_USER',
        method: 'POST'
      },
      {
        route: '/device/api/v1/usertokens/updatebulk',
        role: 'SYSTEM_USER',
        method: 'PUT'
      },

    ];
    if (routeRoles && routeRoles.length) {
      for (let i = 0; i < routeRoles.length; i++) {
        let route = await ProjectRoute.findOne({
          uri: routeRoles[i].route.toLowerCase(),
          method: routeRoles[i].method,
          isActive: true,
          isDeleted: false 
        }, { id: 1 });
        let role = await Role.findOne({
          code: (routeRoles[i].role).toUpperCase(),
          isActive: true,
          isDeleted: false 
        }, { id: 1 });
        if (route && route.id && role && role.id) {
          let routeRoleObj = await RouteRole.findOne({
            roleId: role.id,
            routeId: route.id,
            isActive: true, 
            isDeleted: false
          });
          if (!routeRoleObj) {
            await RouteRole.create({
              roleId: role.id,
              routeId: route.id
            });
          }
        }
      };
      console.info('RouteRole model seeded 🍺');
    }
  } catch (error){
    console.log('RouteRole seeder failed.');
  }
}
async function seedUserRole (){
  try {
    let user = await User.findOne({
      'email':'Eugene.Weimann26@hotmail.com',
      'isActive':true,
      'isDeleted':false
    });
    let userRole = await Role.findOne({ code: 'SYSTEM_USER' }, { id: 1 });
    if (user && user.isPasswordMatch('27tmkOORWhqOi9J') && userRole){
      let count = await UserRole.countDocuments({
        userId: user.id,
        roleId: userRole.id,
        isActive: true, 
        isDeleted: false
      });
      if (count == 0) {
        await UserRole.create({
          userId: user.id,
          roleId: userRole.id 
        });
        console.info('user seeded 🍺');
      }   
    }
    let admin = await User.findOne({
      'email':'Kraig_Kautzer17@hotmail.com',
      'isActive':true,
      'isDeleted':false
    });
    let adminRole = await Role.findOne({ code: 'SYSTEM_USER' }, { id: 1 });
    if (admin && admin.isPasswordMatch('z0TPtiNoUnrtR24') && adminRole){
      let count = await UserRole.countDocuments({
        userId: admin.id,
        roleId: adminRole.id,
        isActive: true, 
        isDeleted: false
      });
      if (count == 0) {
        await UserRole.create({
          userId: admin.id,
          roleId: adminRole.id 
        });
        console.info('admin seeded 🍺');
      }   
    }
  } catch (error){
    console.log('UserRole seeder failed.');
  }
}
async function seedUser () {
  try {
    let user = await User.findOne({
      'email':'Eugene.Weimann26@hotmail.com',
      'isActive':true,
      'isDeleted':false
    });
    if (!user || !user.isPasswordMatch('27tmkOORWhqOi9J') ) {
      let user = new User({
        'password':'27tmkOORWhqOi9J',
        'email':'Eugene.Weimann26@hotmail.com',
        'role':authConstant.USER_ROLE.User
      });
      await User.create(user);
    }
    let admin = await User.findOne({
      'email':'Kraig_Kautzer17@hotmail.com',
      'isActive':true,
      'isDeleted':false
    });
    if (!admin || !admin.isPasswordMatch('z0TPtiNoUnrtR24') ) {
      let admin = new User({
        'password':'z0TPtiNoUnrtR24',
        'email':'Kraig_Kautzer17@hotmail.com',
        'role':authConstant.USER_ROLE.Admin
      });
      await User.create(admin);
    }
    console.info('Users seeded🍺');
  } catch (error){
    console.log('Users seeder failed.');
  }
}

async function seedData (allRegisterRoutes){
  await seedUser();
  await seedRole();
  await seedProjectRoutes(allRegisterRoutes);
  await seedRouteRole();
  await seedUserRole();
}     

module.exports = seedData;