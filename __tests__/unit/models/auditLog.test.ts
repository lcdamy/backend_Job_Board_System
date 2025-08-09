import { AuditLog } from '../../../src/models/AuditLog';
import { db } from '../../../src/config/db';
import { TestHelper } from '../../helpers/testHelper';

describe('AuditLog Model', () => {
    beforeAll(async () => {
        await TestHelper.setupTestDatabase();
    });

    afterAll(async () => {
        await TestHelper.cleanupTestDatabase();
    });

    describe('AuditLog model functions', () => {
        it('should create a new audit log successfully', async () => {
            const auditData = new AuditLog(
                new Date(),
                'POST',
                '/api/test',
                201,
                'jest-agent',
                new Date(),
                new Date(),
                '100ms',
                'admin',
                '127.0.0.1',
                'CREATE',
                'Created a resource',
                'success',
                '{"result":"ok"}',
                '{"input":"test"}'
            );

            const savedAudit = await AuditLog.save(auditData);

            expect(savedAudit).toBeDefined();
            expect(savedAudit.id).toBeDefined();
            expect(savedAudit.method).toBe('POST');
            expect(savedAudit.url).toBe('/api/test');
            expect(savedAudit.statusCode).toBe(201);
            expect(savedAudit.userAgent).toBe('jest-agent');
            expect(savedAudit.doneBy).toBe('admin');
            expect(savedAudit.activity).toBe('CREATE');
            expect(savedAudit.status).toBe('success');
        });

        it('should find audit log by id', async () => {
            const auditData = new AuditLog(
                new Date(),
                'GET',
                '/api/find',
                200,
                'jest-agent',
                new Date(),
                new Date(),
                '50ms',
                'user1',
                '192.168.1.1',
                'READ',
                'Fetched resource',
                'success',
                '{"result":"found"}',
                '{"query":"find"}'
            );

            const savedAudit = await AuditLog.save(auditData);
            const foundAudit = await AuditLog.findOne(savedAudit.id!);

            expect(foundAudit).toBeDefined();
            expect(foundAudit?.id).toBe(savedAudit.id);
            expect(foundAudit?.url).toBe('/api/find');
            expect(foundAudit?.activity).toBe('READ');
        });

        it('should return null when audit log not found by id', async () => {
            const foundAudit = await AuditLog.findOne('nonexistent-id-123');
            expect(foundAudit).toBeNull();
        });

        it('should get all audit logs', async () => {
            // Clear all first
            await new Promise<void>((resolve, reject) => {
                db.run('DELETE FROM audit_logs', [], err => (err ? reject(err) : resolve()));
            });

            // Create test audit logs
            const audit1 = new AuditLog(
                new Date(),
                'GET',
                '/api/all1',
                200,
                'jest-agent',
                new Date(),
                new Date(),
                '10ms',
                'userA',
                '1.1.1.1',
                'READ',
                'Read all 1',
                'success',
                '{"result":"ok"}',
                '{"input":"all1"}'
            );
            const audit2 = new AuditLog(
                new Date(),
                'POST',
                '/api/all2',
                201,
                'jest-agent',
                new Date(),
                new Date(),
                '20ms',
                'userB',
                '2.2.2.2',
                'CREATE',
                'Created all 2',
                'success',
                '{"result":"ok"}',
                '{"input":"all2"}'
            );

            await AuditLog.save(audit1);
            await AuditLog.save(audit2);

            const allAudits = await AuditLog.find();
            expect(allAudits.length).toBe(2);
            expect(allAudits.map(a => a.url)).toContain('/api/all1');
            expect(allAudits.map(a => a.url)).toContain('/api/all2');
        });
    });
});