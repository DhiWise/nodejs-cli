
const model = require('../model');
const { replaceAll } = require('../utils/common');
const authConstant = require('../constants/authConstant');

const {
  userRole, routeRole, projectRoute, role, user
} = model;
const userRoleDbService = require('../services/dbService')({ model: userRole });
const routeRoleDbService = require('../services/dbService')({ model: routeRole });
const projectRouteDbService = require('../services/dbService')({ model: projectRoute });
const roleDbService = require('../services/dbService')({ model:  role });
const userDbService = require('../services/dbService')({ model: user });

async function seedRole () {
  try {
    const roles = [ 'User', 'Admin', 'SYSTEM_USER' ];
    for (let i = 0; i < roles.length; i++) {
      let result = await roleDbService.findOne({
        name: roles[i],
        isActive: true,
        isDeleted: false
      });
      if (!result) {
        await roleDbService.createOne({
          name: roles[i],
          code: roles[i].toUpperCase(),
          weight: 1
        });
      }
    }
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
            let result = await projectRouteDbService.findOne(routeObj);
            if (!result) {
              await projectRouteDbService.createOne(routeObj);
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
        route: '/admin/userauthsettings/create',
        role: 'SYSTEM_USER',
        method: 'POST'
      },
      {
        route: '/admin/userauthsettings/list',
        role: 'SYSTEM_USER',
        method: 'POST'
      },
      {
        route: '/admin/userauthsettings/aggregate',
        role: 'SYSTEM_USER',
        method: 'POST'
      },
      {
        route: '/admin/userauthsettings/:id',
        role: 'SYSTEM_USER',
        method: 'GET'
      },
      {
        route: '/admin/userauthsettings/count',
        role: 'SYSTEM_USER',
        method: 'POST'
      },
      {
        route: '/admin/userauthsettings/update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT'
      },
      {
        route: '/admin/userauthsettings/partial-update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT'
      },
      {
        route: '/admin/userauthsettings/softdelete/:id',
        role: 'SYSTEM_USER',
        method: 'PUT'
      },
      {
        route: '/admin/userauthsettings/softdeletemany',
        role: 'SYSTEM_USER',
        method: 'PUT'
      },
      {
        route: '/admin/userauthsettings/delete/:id',
        role: 'SYSTEM_USER',
        method: 'DELETE'
      },
      {
        route: '/admin/userauthsettings/deletemany',
        role: 'SYSTEM_USER',
        method: 'DELETE'
      },
      {
        route: '/admin/userauthsettings/addbulk',
        role: 'SYSTEM_USER',
        method: 'POST'
      },
      {
        route: '/admin/userauthsettings/updatebulk',
        role: 'SYSTEM_USER',
        method: 'PUT'
      },
      {
        route: '/admin/usertoken/create',
        role: 'SYSTEM_USER',
        method: 'POST'
      },
      {
        route: '/admin/usertoken/list',
        role: 'SYSTEM_USER',
        method: 'POST' 
      },
      {
        route: '/admin/usertoken/aggregate',
        role: 'SYSTEM_USER',
        method: 'POST'
      },
      {
        route: '/admin/usertoken/:id',
        role: 'SYSTEM_USER',
        method: 'GET' 
      },
      {
        route: '/admin/usertoken/count',
        role: 'SYSTEM_USER',
        method: 'POST'
      },
      {
        route: '/admin/usertoken/update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT'
      },
      {
        route: '/admin/usertoken/partial-update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT'
      },
      {
        route: '/admin/usertoken/softdelete/:id',
        role: 'SYSTEM_USER',
        method: 'PUT'
      },
      {
        route: '/admin/usertoken/softdeletemany',
        role: 'SYSTEM_USER',
        method: 'PUT'
      },
      {
        route: '/admin/usertoken/delete/:id',
        role: 'SYSTEM_USER',
        method: 'DELETE'
      },
      {
        route: '/admin/usertoken/deletemany',
        role: 'SYSTEM_USER',
        method: 'DELETE'
      },
      {
        route: '/admin/usertoken/addbulk',
        role: 'SYSTEM_USER',
        method: 'POST'
      },
      {
        route: '/admin/usertoken/updatebulk',
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
        route: '/device/api/v1/userauthsettings/create',
        role: 'SYSTEM_USER',
        method: 'POST'
      },
      {
        route: '/device/api/v1/userauthsettings/list',
        role: 'SYSTEM_USER',
        method: 'POST'
      },
      {
        route: '/device/api/v1/userauthsettings/aggregate',
        role: 'SYSTEM_USER',
        method: 'POST'
      },
      {
        route: '/device/api/v1/userauthsettings/:id',
        role: 'SYSTEM_USER',
        method: 'GET'
      },
      {
        route: '/device/api/v1/userauthsettings/count',
        role: 'SYSTEM_USER',
        method: 'POST'
      },
      {
        route: '/device/api/v1/userauthsettings/update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/userauthsettings/partial-update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/userauthsettings/softdelete/:id',
        role: 'SYSTEM_USER',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/userauthsettings/softdeletemany',
        role: 'SYSTEM_USER',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/userauthsettings/delete/:id',
        role: 'SYSTEM_USER',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/userauthsettings/deletemany',
        role: 'SYSTEM_USER',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/userauthsettings/addbulk',
        role: 'SYSTEM_USER',
        method: 'POST'
      },
      {
        route: '/device/api/v1/userauthsettings/updatebulk',
        role: 'SYSTEM_USER',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/usertoken/create',
        role: 'SYSTEM_USER',
        method: 'POST'
      },
      {
        route: '/device/api/v1/usertoken/list',
        role: 'SYSTEM_USER',
        method: 'POST'
      },
      {
        route: '/device/api/v1/usertoken/aggregate',
        role: 'SYSTEM_USER',
        method: 'POST'
      },
      {
        route: '/device/api/v1/usertoken/:id',
        role: 'SYSTEM_USER',
        method: 'GET'
      },
      {
        route: '/device/api/v1/usertoken/count',
        role: 'SYSTEM_USER',
        method: 'POST'
      },
      {
        route: '/device/api/v1/usertoken/update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/usertoken/partial-update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/usertoken/softdelete/:id',
        role: 'SYSTEM_USER',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/usertoken/softdeletemany',
        role: 'SYSTEM_USER',
        method: 'PUT'
      },
      {
        route: '/device/api/v1/usertoken/delete/:id',
        role: 'SYSTEM_USER',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/usertoken/deletemany',
        role: 'SYSTEM_USER',
        method: 'DELETE'
      },
      {
        route: '/device/api/v1/usertoken/addbulk',
        role: 'SYSTEM_USER',
        method: 'POST'
      },
      {
        route: '/device/api/v1/usertoken/updatebulk',
        role: 'SYSTEM_USER',
        method: 'PUT'
      },

    ];
    if (routeRoles && routeRoles.length) {
      for (let i = 0; i < routeRoles.length; i++) {
        let route = await projectRouteDbService.findOne({
          uri: routeRoles[i].route.toLowerCase(),
          method: routeRoles[i].method,
          isActive: true,
          isDeleted: false
        }, { attributes: ['id'] });
        let role = await roleDbService.findOne({
          code: (routeRoles[i].role).toUpperCase(),
          isActive: true,
          isDeleted: false 
        }, { attributes: ['id'] });
        if (route && route.id && role && role.id) {
          let routeRoleObj = await routeRoleDbService.findOne({
            roleId: role.id,
            routeId: route.id,
            isActive: true,
            isDeleted: false
          });
          if (!routeRoleObj) {
            await routeRoleDbService.createOne({
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
    let user = await userDbService.findOne({
      'email':'Tavares.Murray@yahoo.com',
      'isActive':true,
      'isDeleted':false
    });
    let userRole = await roleDbService.findOne({
      code: 'SYSTEM_USER',
      isActive: true,
      isDeleted: false
    }, { attributes: ['id'] });
    if (user && userRole) {
      let count = await userRoleDbService.count({
        userId: user.id,
        roleId: userRole.id,
        isActive: true, 
        isDeleted: false
      });
      if (count == 0) {
        await userRoleDbService.createOne({
          userId: user.id,
          roleId: userRole.id
        });
        console.info('user seeded 🍺');
      }
    }
    let admin = await userDbService.findOne({
      'email':'Nigel_Roberts75@yahoo.com',
      'isActive':true,
      'isDeleted':false
    });
    let adminRole = await roleDbService.findOne({
      code: 'SYSTEM_USER',
      isActive: true,
      isDeleted: false
    }, { attributes: ['id'] });
    if (admin && adminRole) {
      let count = await userRoleDbService.count({
        userId: admin.id,
        roleId: adminRole.id,
        isActive: true, 
        isDeleted: false
      });
      if (count == 0) {
        await userRoleDbService.createOne({
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
    let user = await userDbService.findOne({
      'email':'Tavares.Murray@yahoo.com',
      'isActive':true,
      'isDeleted':false
    });
    if (!user || !user.isPasswordMatch('V5K5v_4yVz1ycq5')) {
      let user = {
        'password':'V5K5v_4yVz1ycq5',
        'email':'Tavares.Murray@yahoo.com',
        'role':authConstant.USER_ROLE.User
      };
      await userDbService.createOne(user);
    }
    let admin = await userDbService.findOne({
      'email':'Nigel_Roberts75@yahoo.com',
      'isActive':true,
      'isDeleted':false
    });
    if (!admin || !admin.isPasswordMatch('HNSHuI3arQyHzIb')) {
      let admin = {
        'password':'HNSHuI3arQyHzIb',
        'email':'Nigel_Roberts75@yahoo.com',
        'role':authConstant.USER_ROLE.Admin
      };
      await userDbService.createOne(admin);
    }
    console.info('User model seeded🍺');
  } catch (error) {
    console.log('User seeder failed. ');
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