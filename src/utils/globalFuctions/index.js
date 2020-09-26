import Toast from '../../utils/toast'
import colors from '../../utils/colors'
import Modal from '../modal'

global.Toast = function (text){
    Toast.show(text);
}

global.colors = colors;

global.Modal = Modal;