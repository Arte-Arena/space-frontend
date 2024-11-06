import mock from './mock';
import './notes/NotesData';
import './chat/Chatdata';
import './email/EmailData';
import './ticket/TicketData';
import './contacts/ContactsData';
import './eCommerce/ProductsData';
import './userprofile/PostData';
import './userprofile/UsersData';
import './blog/blogData';
import './kanban/KanbanData';
import './invoice/invoiceLists';

mock.onAny().passThrough();
