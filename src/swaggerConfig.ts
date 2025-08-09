import swaggerJsdoc from 'swagger-jsdoc';

const getServerUrl = () => {
    const host = process.env.HOST || 'localhost';
    const port = process.env.PORT || 4000;
    if (host === 'https://backend-isco-challenge.onrender.com') {
        return host;
    }
    return `http://${host}:${port}`;
};

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'ISCO CHALLENGE API',
            version: '1.0.0',
            description: 'API documentation for the ISCO HR platform challenge',
        },
        servers: [
            {
                url: getServerUrl(),
                description: `${process.env.APPLICATION_STAGE} server`,
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                JobDTO: {
                    type: 'object',
                    required: ['title', 'description', 'company', 'location', 'deadline', 'status', 'type'],
                    properties: {
                        title: {
                            type: 'string',
                            example: 'Software Engineer'
                        },
                        description: {
                            type: 'string',
                            example: 'Responsible for developing backend services.'
                        },
                        company: {
                            type: 'string',
                            example: 'Isco Tech'
                        },
                        location: {
                            type: 'string',
                            example: 'Kigali, Rwanda'
                        },
                        deadline: {
                            type: 'string',
                            format: 'date',
                            example: '2025-09-01'
                        },
                        status: {
                            type: 'string',
                            enum: ['open', 'closed'],
                            example: 'open'
                        },
                        type: {
                            type: 'string',
                            enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
                            example: 'full-time'
                        }
                    }
                },
                ApplicationDTO: {
                    type: 'object',
                    required: ['jobId', 'coverLetter', 'resumeURL'],
                    properties: {
                        jobId: {
                            type: 'integer',
                            example: 1
                        },
                        coverLetter: {
                            type: 'string',
                            example: 'I am very interested in this position...'
                        },
                        resumeURL: {
                            type: 'string',
                            example: 'https://example.com/resume.pdf'
                        },
                        phoneNumber: {
                            type: 'string',
                            example: '+250788123456'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'applicant@example.com'
                        },
                        linkedInProfile: {
                            type: 'string',
                            example: 'https://linkedin.com/in/username'
                        },
                        jobTitle: {
                            type: 'string',
                            example: 'Software Engineer'
                        }
                    }
                },
                UserCreateDTO: {
                    type: 'object',
                    required: ['names', 'email', 'password', 'type', 'registrationType', 'userStatus'],
                    properties: {
                        names: {
                            type: 'string',
                            example: 'John Doe'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'john.doe@example.com'
                        },
                        password: {
                            type: 'string',
                            minLength: 6,
                            example: 'securePassword123'
                        },
                        type: {
                            type: 'string',
                            enum: ['admin', 'job-seeker'],
                            example: 'job-seeker'
                        },
                        registrationType: {
                            type: 'string',
                            enum: ['manual', 'oauth'],
                            example: 'manual'
                        },
                        userStatus: {
                            type: 'string',
                            enum: ['active', 'inactive', 'pending'],
                            example: 'pending'
                        },
                        profilePictureURL: {
                            type: 'string',
                            example: 'https://example.com/profile.jpg'
                        }
                    }
                },
                UserLoginDTO: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'user@example.com'
                        },
                        password: {
                            type: 'string',
                            example: 'password123'
                        }
                    }
                },
                Job: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            example: 1
                        },
                        title: {
                            type: 'string',
                            example: 'Software Engineer'
                        },
                        description: {
                            type: 'string',
                            example: 'Responsible for developing backend services.'
                        },
                        company: {
                            type: 'string',
                            example: 'Isco Tech'
                        },
                        location: {
                            type: 'string',
                            example: 'Kigali, Rwanda'
                        },
                        deadline: {
                            type: 'string',
                            format: 'date-time',
                            example: '2025-09-01T00:00:00Z'
                        },
                        status: {
                            type: 'string',
                            enum: ['open', 'closed'],
                            example: 'open'
                        },
                        type: {
                            type: 'string',
                            enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
                            example: 'full-time'
                        },
                        postedBy: {
                            type: 'integer',
                            example: 1
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2025-08-01T00:00:00Z'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2025-08-01T00:00:00Z'
                        },
                        applications: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/Application'
                            }
                        }
                    }
                },
                Application: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            example: 1
                        },
                        jobId: {
                            type: 'integer',
                            example: 1
                        },
                        userId: {
                            type: 'integer',
                            example: 1
                        },
                        coverLetter: {
                            type: 'string',
                            example: 'I am very interested in this position...'
                        },
                        resumeURL: {
                            type: 'string',
                            example: 'https://example.com/resume.pdf'
                        },
                        status: {
                            type: 'string',
                            enum: ['pending', 'accepted', 'rejected'],
                            example: 'pending'
                        },
                        phoneNumber: {
                            type: 'string',
                            example: '+250788123456'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'applicant@example.com'
                        },
                        linkedInProfile: {
                            type: 'string',
                            example: 'https://linkedin.com/in/username'
                        },
                        jobTitle: {
                            type: 'string',
                            example: 'Software Engineer'
                        },
                        names: {
                            type: 'string',
                            example: 'John Doe'
                        },
                        appliedAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2025-08-01T00:00:00Z'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2025-08-01T00:00:00Z'
                        }
                    }
                },
                ApiResponse: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            enum: ['success', 'error'],
                            example: 'success'
                        },
                        message: {
                            type: 'string',
                            example: 'Operation completed successfully'
                        },
                        data: {
                            type: 'object',
                            description: 'Response data'
                        }
                    }
                },
                PaginatedJobsResponse: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/Job'
                            }
                        },
                        total: {
                            type: 'integer',
                            example: 100
                        },
                        page: {
                            type: 'integer',
                            example: 1
                        },
                        lastPage: {
                            type: 'integer',
                            example: 10
                        }
                    }
                }
            }
        }
    },
    apis: [
        './src/routes/*.ts',
        './src/routes/v1/*.ts'
    ], // Path to the API docs
};

const specs = swaggerJsdoc(options);
export default specs;
