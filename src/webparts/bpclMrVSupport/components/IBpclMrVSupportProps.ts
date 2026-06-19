import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPFI } from '@pnp/sp';
export interface IBpclMrVSupportProps {
  description: string;

  isDarkTheme: boolean;

  environmentMessage: string;

  hasTeamsContext: boolean;

  userDisplayName: string;

  context: WebPartContext;
  sp: SPFI;
}