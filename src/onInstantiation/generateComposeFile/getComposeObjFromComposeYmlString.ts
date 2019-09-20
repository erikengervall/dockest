import { safeLoad } from 'js-yaml'
import { ComposeFile } from '../../runners/@types'

export default (composeYml: string) => {
  const composeObj: ComposeFile = safeLoad(composeYml)
  return composeObj
}
