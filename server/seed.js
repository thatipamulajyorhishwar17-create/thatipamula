const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, 'data', 'users.json');

const adminUsers = [
    {
        id: 'admin',
        name: 'Admin',
        email: 'admin@company.com',
        password: 'admin123',
        role: 'admin',
        created_at: new Date().toISOString()
    },
    {
        id: 'thatipamulajyothishwargoud@gmail.com',
        name: 'Jyothishwar Goud Thatipamula',
        email: 'thatipamulajyothishwargoud@gmail.com',
        password: 'Bhanu@9002',
        role: 'admin',
        created_at: new Date().toISOString()
    }
];

async function seed() {
    console.log('Seeding admin users...');

    const seededUsers = [];
    for (const user of adminUsers) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        seededUsers.push({
            ...user,
            password: hashedPassword
        });
        console.log(`  Created admin: ${user.email} (${user.name})`);
    }

    fs.writeFileSync(USERS_FILE, JSON.stringify(seededUsers, null, 2));
    console.log(`\nSuccessfully seeded ${seededUsers.length} admin user(s) to ${USERS_FILE}`);
}

seed().catch(err => {
    console.error('Seed failed:', err);
    process.exit(1);
});
