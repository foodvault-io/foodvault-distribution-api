import { PrismaClient, RoleEnum } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';

export async function createRandomUser() {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();

    return {
        email: faker.internet.email(firstName, lastName, 'foodvault.io'),
        firstName: firstName,
        lastName: lastName,
        hashedPassword: await argon.hash('password'),
        image: faker.image.avatar(),
        role: faker.helpers.arrayElement([RoleEnum.USER, RoleEnum.RESTAURANT ]),
    };
}

export async function createAdminUser() {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();

    return {
        email: faker.internet.email(firstName, lastName, 'foodvault.io'),
        firstName: firstName,
        lastName: lastName,
        hashedPassword: await argon.hash('password'),
        image: faker.image.avatar(),
        role: RoleEnum.ADMIN,
    };
}

const usStates: {name: string, code: string}[] = [
    { name: 'Alabama', code: 'AL' },
    { name: 'Alaska', code: 'AK' },
    { name: 'Arizona', code: 'AZ' },
    { name: 'Arkansas', code: 'AR' },
    { name: 'California', code: 'CA' },
    { name: 'Colorado', code: 'CO' },
    { name: 'Connecticut', code: 'CT' },
    { name: 'Delaware', code: 'DE' },
    { name: 'Florida', code: 'FL' },
    { name: 'Georgia', code: 'GA' },
    { name: 'Hawaii', code: 'HI' },
    { name: 'Idaho', code: 'ID' },
    { name: 'Illinois', code: 'IL' },
    { name: 'Indiana', code: 'IN' },
    { name: 'Iowa', code: 'IA' },
    { name: 'Kansas', code: 'KS' },
    { name: 'Kentucky', code: 'KY' },
    { name: 'Louisiana', code: 'LA' },
    { name: 'Maine', code: 'ME' },
    { name: 'Maryland', code: 'MD' },
    { name: 'Massachusetts', code: 'MA' },
    { name: 'Michigan', code: 'MI' },
    { name: 'Minnesota', code: 'MN' },
    { name: 'Mississippi', code: 'MS' },
    { name: 'Missouri', code: 'MO' },
    { name: 'Montana', code: 'MT' },
    { name: 'Nebraska', code: 'NE' },
    { name: 'Nevada', code: 'NV' },
    { name: 'New Hampshire', code: 'NH' },
    { name: 'New Jersey', code: 'NJ' },
    { name: 'New Mexico', code: 'NM' },
    { name: 'New York', code: 'NY' },
    { name: 'North Carolina', code: 'NC' },
    { name: 'North Dakota', code: 'ND' },
    { name: 'Ohio', code: 'OH' },
    { name: 'Oklahoma', code: 'OK' },
    { name: 'Oregon', code: 'OR' },
    { name: 'Pennsylvania', code: 'PA' },
    { name: 'Rhode Island', code: 'RI' },
    { name: 'South Carolina', code: 'SC' },
    { name: 'South Dakota', code: 'SD' },
    { name: 'Tennessee', code: 'TN' },
    { name: 'Texas', code: 'TX' },
    { name: 'Utah', code: 'UT' },
    { name: 'Vermont', code: 'VT' },
    { name: 'Virginia', code: 'VA' },
    { name: 'Washington', code: 'WA' },
    { name: 'West Virginia', code: 'WV' },
    { name: 'Wisconsin', code: 'WI' },
    { name: 'Wyoming', code: 'WY' }
];

const newUsers = [];
const newAccounts = [];
const newCities = [];
const newStates = [];
const newRestaurants = [];
const newOrders = [];
const newOrderItems = [];
const newProducts = [];
const newTags = [];
const newFoodOrders = [];
const newFoodOrderItems = [];
const newDistributors = [];
const newMedia = [];

const prisma = new PrismaClient();


async function main() {
    const jwtService = new JwtService();

    // clean db
    await prisma.$transaction([
        prisma.user.deleteMany(),
        prisma.account.deleteMany(),
        prisma.restaurantDetails.deleteMany(),
        prisma.restaurantOrder.deleteMany(),
        prisma.orderItem.deleteMany(),
        prisma.product.deleteMany(),
        prisma.foodOrder.deleteMany(),
        prisma.foodOrderItem.deleteMany(),
        prisma.distributor.deleteMany(),
        prisma.media.deleteMany(),
        prisma.country.deleteMany(),
        prisma.state.deleteMany(),
        prisma.city.deleteMany(),
    ]);

    // create OAuth2 users & accounts
    for (let i = 0; i <= 49; ++i) {
        const userData = await createRandomUser();

        const user = await prisma.user.create({
            data: {
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                hashedPassword: userData.hashedPassword,
                image: userData.image,
                role: userData.role,
                accounts: {
                    create: {
                        providerType: 'oauth2',
                        provider: faker.helpers.arrayElement(['google', 'facebook', 'linkedin']),
                        providerAccountId: faker.datatype.string(15),
                        accessTokenExpires: 60 * 15,
                        tokenType: 'Bearer'
                    }
                }
            }
        });

        newUsers.push(user);

        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role
        }

        const secret = 'super-secret-key-for-seed';
        const seedAccessToken = jwtService.sign(
            payload,
            {
                secret: secret,
                expiresIn: '15m'
            }
        )

        const seedRefreshToken = jwtService.sign(
            payload,
            {
                secret: secret,
                expiresIn: '30d'
            }
        )

        const account = await prisma.account.update({
            where: {
                userId: user.id
            },
            data: {
                accessToken: seedAccessToken,
                refreshToken: await argon.hash(seedRefreshToken),
            }
        });

        newAccounts.push(account);
    }

    // create local users & accounts
    for (let i = 0; i <= 49; ++i) {
        const userData = await createRandomUser();

        const user = await prisma.user.create({
            data: {
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                hashedPassword: userData.hashedPassword,
                image: userData.image,
                role: userData.role,
                accounts: {
                    create: {
                        providerType: 'email',
                        provider: 'local',
                        providerAccountId: faker.datatype.string(15),
                        accessTokenExpires: 60 * 15,
                        tokenType: 'Bearer'
                    }
                }
            }
        });

        newUsers.push(user);

        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role
        }

        const secret = 'super-secret-key-for-seed';
        const seedAccessToken = jwtService.sign(
            payload,
            {
                secret: secret,
                expiresIn: '15m'
            }
        )

        const seedRefreshToken = jwtService.sign(
            payload,
            {
                secret: secret,
                expiresIn: '30d'
            }
        )

        const account = await prisma.account.update({
            where: {
                userId: user.id
            },
            data: {
                accessToken: seedAccessToken,
                refreshToken: await argon.hash(seedRefreshToken),
            }
        });

        newAccounts.push(account);
    }

    // create Admin users & Accounts
    for (let i = 0; i <= 9; ++i) {
        const userData = await createAdminUser();

        const user = await prisma.user.create({
            data: {
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                hashedPassword: userData.hashedPassword,
                image: userData.image,
                role: userData.role,
                accounts: {
                    create: {
                        providerType: 'email',
                        provider: 'local',
                        providerAccountId: faker.datatype.string(15),
                        accessTokenExpires: 60 * 15,
                        tokenType: 'Bearer'
                    }
                }
            }
        });

        newUsers.push(user);

        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role
        }

        const secret = 'super-secret-key-for-seed';
        const seedAccessToken = jwtService.sign(
            payload,
            {
                secret: secret,
                expiresIn: '15m'
            }
        )

        const seedRefreshToken = jwtService.sign(
            payload,
            {
                secret: secret,
                expiresIn: '30d'
            }
        )

        const account = await prisma.account.update({
            where: {
                userId: user.id
            },
            data: {
                accessToken: seedAccessToken,
                refreshToken: await argon.hash(seedRefreshToken),
            }
        });

        newAccounts.push(account);
    }

    // Create Country Data;
    const country = await prisma.country.create({
        data: {
            name: 'United States of America', 
            code: 'USA'
        }
    })
    
    // Create State Data:
    for (const state of usStates) {
        const newState = await prisma.state.create({
            data: {
                name: state.name,
                code: state.code,
                country: {
                    connect: {
                        id: country.id
                    }
                }
            }
        })
        
        newStates.push(newState);
    }
    
    // Create City Data:
    for (let i = 0; i <= 199; ++i) {
        const cityName = faker.address.city();
        
        const city = await prisma.city.create({
            data: {
                name: cityName,
                state: {
                    connect: {
                        id: faker.helpers.arrayElement(newStates).id
                    }
                }
            }
        });
        
        newCities.push(city);
    }

    // Create Media Data: 
    for (let i = 0; i <= 299; ++i) {
        const media = await prisma.media.create({
            data: {
                fileName: faker.system.commonFileName(),
                fileSize: faker.datatype.bigInt(),
                fileUrl: faker.image.imageUrl(),
                fileType: faker.system.commonFileExt(),
            }
        });

        newMedia.push(media);
    }
    
    // Create Restaurant Details Data: 
    for (let i = 0; i <= 399; ++i) {
        const restaurantDetails = await prisma.restaurantDetails.create({
            data: {
                name: faker.company.name(),
                phone: faker.phone.number(),
                description: faker.company.catchPhrase(),
                website: faker.internet.domainName(),
                image: faker.image.business(),
                address: faker.address.streetAddress(true),
                city: {
                    connect: {
                        id: faker.helpers.arrayElement(newCities).id
                    }
                },
                state: {
                    connect: {
                        id: faker.helpers.arrayElement(newStates).id
                    }
                },
                country: {
                    connect: {
                        id: country.id
                    }
                },
                zip: faker.address.zipCodeByState(faker.helpers.arrayElement(newStates).code),
                lat: faker.address.latitude(),
                lon: faker.address.longitude(),
                images: {
                    connect: {
                        id: faker.helpers.arrayElement(newMedia).id
                    }
                }, 
                ownerUser: {
                    connect: {
                        id: faker.helpers.arrayElement(newUsers).id,
                    }
                },
            }
        });

        newRestaurants.push(restaurantDetails);
    }

    // Restaurant Oders Data: 
    for (let i = 0; i <= 999; ++i) {
        const restaurantOrder = await prisma.restaurantOrder.create({
            data: {
                restaurant: {
                    connect: {
                        id: faker.helpers.arrayElement(newRestaurants).id
                    }
                }
            }
        }); 

        newOrders.push(restaurantOrder);
    }

    // Tags Data: 
    const tagArray = [
        'Vegan',
        'Vegetarian',
        'Gluten Free',
        'Dairy Free',
        'Halal',
        'Kosher',
        'Spicy',
        'Salty',
        'Sweet',
    ]
    for (const tag of tagArray) {
        const newTag = await prisma.tag.create({
            data: {
                name: tag
            }
        });

        newTags.push(newTag);
    }

    // Product Data: 
    for (let i = 0; i <= 299; ++i) {
        const sizeValue = faker.datatype.number(10);
        const sizeUnit = faker.helpers.arrayElement(['oz', 'lb', 'g', 'kg']);
        const size = `${sizeValue} ${sizeUnit}`;

        const product = await prisma.product.create({
            data: {
                name: faker.commerce.productName(), 
                description: faker.commerce.productDescription(),
                size: size,
                sizeUnit: sizeUnit,
                sizeValue: sizeValue,
                rating: faker.datatype.number(5),
                tags: {
                    connect: {
                        id: faker.helpers.arrayElement(newTags).id
                    }
                },
                image: {
                    create: {
                        fileName: faker.system.commonFileName(),
                        fileSize: faker.datatype.bigInt(),
                        fileUrl: faker.image.food(),
                        fileType: faker.system.commonFileExt(),
                    }
                }
            }
        });

        newProducts.push(product);
    }

    // Create Order Items Data: 
    for (let i = 0; i <= 3999; ++i) {
        const orderItem = await prisma.orderItem.create({
            data: {
                quantity: faker.datatype.number(100),
                product: {
                    connect: {
                        id: faker.helpers.arrayElement(newProducts).id
                    }
                },
                orderPlaced: {
                    connect: {
                        id: faker.helpers.arrayElement(newOrders).id
                    }
                }
            }
        });

        newOrderItems.push(orderItem);
    }

    // Create Distributor Data: 
    for (let i = 0; i <= 499; ++i) {
        const distributorName = faker.company.name();
        const cityId = faker.helpers.arrayElement(newCities).id;
        const stateId = faker.helpers.arrayElement(newStates).id;


        const distributor = await prisma.distributor.create({
            data: {
                name: distributorName,
                description: faker.company.catchPhrase(),
                phone: faker.phone.number(),
                email: faker.internet.email(),
                website: `${distributorName.toLowerCase().replace(/ /g, '-')}.com`,
                address: faker.address.streetAddress(true),
                city: {
                    connect: {
                        id: cityId
                    }
                },
                state: {
                    connect: {
                        id: stateId
                    }
                },
                country: {
                    connect: {
                        id: country.id
                    }
                },
                zip: faker.address.zipCodeByState(stateId.code),
                lat: faker.address.latitude(),
                lon: faker.address.longitude(),
                images: {
                    create: [{
                        fileName: faker.system.commonFileName(),
                        fileSize: faker.datatype.bigInt(),
                        fileUrl: faker.image.imageUrl(),
                        fileType: faker.system.commonFileExt(),
                    }, {
                        fileName: faker.system.commonFileName(),
                        fileSize: faker.datatype.bigInt(),
                        fileUrl: faker.image.imageUrl(),
                        fileType: faker.system.commonFileExt(),
                    }, {
                        fileName: faker.system.commonFileName(),
                        fileSize: faker.datatype.bigInt(),
                        fileUrl: faker.image.imageUrl(),
                        fileType: faker.system.commonFileExt(),
                    }]
                }
            }
        });

        newDistributors.push(distributor);
    }

    // FoodOrder data: 
    for (let i = 0; i <= 1999; ++i) {
        const distributor = faker.helpers.arrayElement(newDistributors);

        const foodOrder = await prisma.foodOrder.create({
            data: {
                orderName: faker.commerce.productName(),
                dateOfOrder: faker.date.past(),
                orderDescription: faker.commerce.productDescription(),
                distributor: distributor.name,
                distributorInfo: {
                    connect: {
                        id: distributor.id
                    }
                },
                restaurant: {
                    connect: {
                        id: faker.helpers.arrayElement(newRestaurants).id
                    }
                }
            }
        });

        newFoodOrders.push(foodOrder);
    }

    // FoodOrderItem data: 
    for (let i = 0; i <= 4999; ++i) {
        const foodOrderItem = await prisma.foodOrderItem.create({
            data: {
                productName: faker.commerce.productName(),
                product: {
                    connect: {
                        id: faker.helpers.arrayElement(newProducts).id
                    }
                }, 
                description: faker.commerce.productDescription(),
                quantity: faker.datatype.number(1000),
                price: faker.commerce.price(),
                foodOrder: {
                    connect: {
                        id: faker.helpers.arrayElement(newFoodOrders).id
                    }
                }
            }
        });

        newFoodOrderItems.push(foodOrderItem);
    }

}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    });