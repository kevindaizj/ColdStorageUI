import { ElectronService } from './electron/electron.service';
import { NotificationService } from './notification/notification.service';
import { SimpleDictService } from './dict/simple-dict.service';
import { SimpleDictCacheService } from './dict/simple-dict-cache.service';
import { Base64Service } from './base64/base64.service';
import { HttpPlusService } from './http/http-plus.service';
import { DCDialogService } from './dialog/dialog.service';
import { MessagePlusService } from './messages/message-plus.service';
import { SearchTabsService } from './list/search-tabs.service';
import { ImagePreviewService } from './image/image-previewer.service';
import { CryptoService } from './crypto/crypto.service';
import { DCMomentService } from './moment/moment.service';
import { TableListService } from './list/table-list.service';
import { TableFrontListService } from './list/table-front-list.service';



export const GLOBAL_SERVICES = [
  ElectronService,
  NotificationService,
  SimpleDictService,
  SimpleDictCacheService,
  Base64Service,
  HttpPlusService,
  DCDialogService,
  MessagePlusService,
  SearchTabsService,
  ImagePreviewService,
  CryptoService,
  DCMomentService,
  TableListService,
  TableFrontListService
];

