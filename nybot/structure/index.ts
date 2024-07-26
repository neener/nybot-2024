import type {StructureResolver} from 'sanity/structure'
import {CalendarIcon, UsersIcon, PinIcon, ImagesIcon, BookIcon, ComposeIcon, WrenchIcon, LemonIcon, BillIcon, BoltIcon} from '@sanity/icons'

export const structure: StructureResolver = (S) =>
  S.list()
    .id('root')
    .title('Content')
    .items([
      S.documentTypeListItem('event').title('Events').icon(CalendarIcon),
      S.documentTypeListItem('location').title('Locations').icon(PinIcon),
      S.documentTypeListItem('artist').title('Artists').icon(UsersIcon),
      S.documentTypeListItem('artwork').title('Artworks').icon(ImagesIcon),
      S.documentTypeListItem('publication').title('Publications').icon(BookIcon),
      S.documentTypeListItem('contact').title('Contact').icon(ComposeIcon),
      S.documentTypeListItem('institution').title('Institutions').icon(WrenchIcon),
      S.documentTypeListItem('gallery').title('Galleries').icon(LemonIcon),
      S.documentTypeListItem('business').title('Businesses').icon(BillIcon),
      S.documentTypeListItem('holding').title('Holdings').icon(BoltIcon)
    ])