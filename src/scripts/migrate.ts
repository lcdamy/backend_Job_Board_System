#!/usr/bin/env node
import { connectDB } from '../config/db';
import { createTablesIfNotExist } from '../database/init';

const runMigrations = async () => {
    try {
        console.log('🔄 Connecting to database...');
        await connectDB();
        
        console.log('🔄 Creating tables...');
        await createTablesIfNotExist();
        
        console.log('✅ Database migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
};

runMigrations();
