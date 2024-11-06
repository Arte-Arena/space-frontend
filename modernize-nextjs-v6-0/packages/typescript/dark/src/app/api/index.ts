import mock from './mock';
import './blog/blogData';
import './contacts/ContactsData';
import './chat/Chatdata';
import './notes/NotesData';
import './ticket/TicketData';
import './eCommerce/ProductsData';
import './email/EmailData';
import './userprofile/PostData';
import './userprofile/UsersData';
import './kanban/KanbanData';
import './invoice/invoceLists';

mock.onAny().passThrough();
