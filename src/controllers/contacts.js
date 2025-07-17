import {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';
import { getEnvVar } from '../utils/getEnvVar.js';

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortOrder, sortBy } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const contacts = await getAllContacts({
    page,
    perPage,
    sortOrder,
    sortBy,
    filter,
    userId: req.user._id,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId, req.user._id);

  if (contact === null) {
    throw new createHttpError(404, 'Contact not found');
  }

  if (contact.userId.toString() !== req.user._id.toString()) {
    throw new createHttpError(403, 'Access denied');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  let photoUrl = null;

  if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
    photoUrl = await uploadToCloudinary(req.file);
  } else {
    await fs.rename(
      path.join('src', 'tmp', req.file.filename),
      path.join('src', 'uploads', req.file.filename),
    );
    photoUrl = `${getEnvVar('APP_DOMAIN')}/uploads/${req.file.filename}`;
  }

  const contact = await createContact({
    ...req.body,
    userId: req.user._id,
    photo: photoUrl,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const updateContactController = async (req, res) => {
  const { contactId } = req.params;

  let photoUrl = null;

  if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
    photoUrl = await uploadToCloudinary(req.file);
  } else {
    await fs.rename(
      path.join('src', 'tmp', req.file.filename),
      path.join('src', 'uploads', req.file.filename),
    );
    photoUrl = `${getEnvVar('APP_DOMAIN')}/uploads/${req.file.filename}`;
  }

  const contact = await updateContact(contactId, {
    ...req.body,
    userId: req.user._id,
    photo: photoUrl,
  });

  if (contact === null) {
    throw new createHttpError(404, 'Contact not found');
  }

  if (contact.userId.toString() !== req.user._id.toString()) {
    throw new createHttpError(403, 'Access denied');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: contact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await deleteContact(contactId, req.user._id);

  if (contact === null) {
    throw new createHttpError(404, 'Contact not found');
  }

  if (contact.userId.toString() !== req.user._id.toString()) {
    throw new createHttpError(403, 'Access denied');
  }

  res.status(204).send();
};
