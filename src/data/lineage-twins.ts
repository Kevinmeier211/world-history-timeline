import type { TwinLink } from './lineage.ts';

/**
 * Equal Appendix B spans stored on purpose in two families.
 * Mughal is not here: the v1 bundle starts in 1206 and the checklist row in 1526.
 */
export const CHECKLIST_TWINS: readonly TwinLink[] = [
  {
    from: 'mamluk_sultanate',
    to: 'mamluk_egypt',
    note: 'Same Appendix B span, 1250–1517, stored in two families. Not a checked conquest.',
  },
  {
    from: 'seljuk',
    to: 'seljuk_iran',
    note: 'Same Appendix B span, 1037–1194, stored in two families. Not a checked conquest.',
  },
  {
    from: 'ilkhanate',
    to: 'ilkhanate_iran',
    note: 'Same Appendix B span, 1256–1335, stored in two families. Not a checked conquest.',
  },
  {
    from: 'timurid',
    to: 'timurid_iran',
    note: 'Same Appendix B span, 1370–1507, stored in two families. Not a checked conquest.',
  },
  {
    from: 'golden_horde',
    to: 'golden_horde_turkic',
    note: 'Same Appendix B span, 1242–1502, stored in two families. Not a checked conquest.',
  },
  {
    from: 'khitan_liao',
    to: 'liao',
    note: 'Same Appendix B span, 916–1125, stored in two families. Not a checked conquest.',
  },
  {
    from: 'jurchen_jin',
    to: 'jin_1115',
    note: 'Same Appendix B span, 1115–1234, stored in two families. Not a checked conquest.',
  },
  {
    from: 'yuan',
    to: 'yuan_china',
    note: 'Same Appendix B span, 1271–1368, stored in two families. Not a checked conquest.',
  },
  {
    from: 'fatimid',
    to: 'fatimid_egypt',
    note: 'Appendix B lists the Fatimid span as 909/969–1171. The Nile row starts at the recorded 969 endpoint. Not a checked conquest.',
  },
];
