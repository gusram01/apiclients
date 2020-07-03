import mongoose from 'mongoose';
import { Person } from '../interfaces/persons.interface';

const categoryPersons: { values: string[], message: string } = {
  values: ['ADMIN', 'USER', 'CLIENT'],
  message: '{VALUE} is not a valid entry'
}

const Schema = mongoose.Schema;

const personSchema = new Schema<Person>({

  creado: {
    type: Date,
    default: new Date().getTime()
  },
  borrado: Date,
  nacimiento: Date,
  nombre: {
    type: String,
    required: [true, 'Nombre es un dato requerido'],
    maxlength: [38, 'Longitud máxima del Nombre: 38 caracteres']
  },
  apellidos: {
    type: String,
    required: [true, 'Los Apellidos son un dato requerido'],
    maxlength: [50, 'Longitud máxima de Apellidos: 50 caracteres']
  },
  telefono: [{
    type: String,
    maxlength: [10, 'Teléfono con longitud máxmima de 10 caracteres']
  }],
  email: {
    type: String,
    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    lowercase: true,
    unique: true,
    required: [true, 'Email es un dato requerido']
  },
  emailstatefalse: {
    type: String,
    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    lowercase: true,
  },
  category: {
    type: String,
    enum: categoryPersons
  },
  password: {
    type: String,
    select: false
  },
  state: {
    type: Boolean,
    default: true
  },
  slug: {
    type: String
  },
  resetPassword: String,
  resetPaswordExpire: Date,

});

export {
  personSchema
}