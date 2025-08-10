import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

// Import modules
import { AuthModule } from './auth/auth.module';
import { QueueModule } from './queue/queue.module';
import { AppointmentModule } from './appointment/appointment.module';
import { DoctorModule } from './doctor/doctor.module';
import { PatientModule } from './patient/patient.module';

// Import entities
import { User } from './auth/entities/user.entity';
import { QueueEntry } from './queue/entities/queue-entry.entity';
import { Appointment } from './appointment/entities/appointment.entity';
import { Doctor } from './doctor/entities/doctor.entity';
import { Patient } from './patient/entities/patient.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_DATABASE || 'clinic_management',
      entities: [User, QueueEntry, Appointment, Doctor, Patient],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'clinic-front-desk-secret',
      signOptions: { expiresIn: '24h' },
    }),
    AuthModule,
    QueueModule,
    AppointmentModule,
    DoctorModule,
    PatientModule,
  ],
})
export class AppModule {}
