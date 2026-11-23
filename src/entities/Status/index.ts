export { default as StatusSelect } from './ui/StatusSelect/StatusSelect.vue'
export type {
    CompanyStatus,
    StatusDefinition,
    StatusTree,
} from './model/types/status'
export { useStatusTree } from './model/services/useStatusTree'
export { hasPhone } from './model/lib/statusRules'
