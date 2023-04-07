import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
////////////////////////// INITIALIZE FIREBASE //////////////////////////
const firebaseConfig = {
  apiKey: 'AIzaSyDLnO2As0AemLgqtaYQSBqaFF_oQn1O1K8',
  authDomain: 'petmart-8be2a.firebaseapp.com',
  projectId: 'petmart-8be2a',
  storageBucket: 'petmart-8be2a.appspot.com',
  messagingSenderId: '998283466149',
  appId: '1:998283466149:web:b11584035bc5ac6740844c',
  measurementId: 'G-E9B9YHYBHE',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  AuthErrorCodes,
} from 'firebase/auth';
const auth = getAuth();
/////////////////////////////////////////////////////////////////////////

////////////////////////// LOGIN AND REGISTER FUNCTIONS /////////////////
function login(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log('Đăng nhập thành công cho user ' + user.email);
      setCurrentUserEmailAndUid(user.email, user.uid);
      alert('Đăng nhập thành công bằng email ' + user.email);
      document.getElementById('login-layout').style.display = 'none';
      enableScroll();
      return true;
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode != AuthErrorCodes.INVALID_MESSAGE_PAYLOAD) {
        var loginStatus = document.getElementById('login-status');
        loginStatus.textContent = 'Mật khẩu không chính xác!';
      }
      const errorMessage = error.message;
      return false;
    });
  return false;
}

function register(email, password) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log('Created a new account successfully: ' + user.displayName);
      setCurrentUserUid(user.uid);
      alert('Đăng kí tài khoản thành công bằng email ' + user.email);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
}
/////////////////////////////////////////////////////////////////////

///////// READ AND WRITE DATA TO FIREBASE FUNCTIONS /////////////////
async function writeData(collectionName, data) {
  try {
    setDoc(doc(db, collectionName, getCurrentUserUid()), data)
      .then(() => {
        console.log('Ghi dữ liệu thành công.');
      })
      .catch((error) => {
        console.error('Error adding document: ', error);
      });
  } catch (e) {
    console.error('Error adding document: ', e);
  }
}

async function readDataById(collectionName, docId) {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      console.log(`${docSnapshot.id} => ${JSON.stringify(docSnapshot.data())}`);

      return docSnapshot.data();
    } else {
      console.log('No such document!');
      return null;
    }
  } catch (e) {
    console.error('Error getting document: ', e);
  }
}
/////////////////////////////////////////////////////////////////////

////////////////// REGISTER EVENT LISTENERS /////////////////////////
document.addEventListener('DOMContentLoaded', function () {
  initLoginLayoutActions();

  var loginButton = document.getElementById('login-button');
  loginButton.addEventListener('click', () => {
    validateLogin();
  });

  initBookingServiceButtons();
});

function initLoginLayoutActions() {
  var loginButton = document.getElementById('login');
  var opaqueLayout = document.getElementById('opaque-layout');
  var loginLayout = document.getElementById('login-layout');

  loginButton.addEventListener('click', function () {
    if (getCurrentUserUid() == null || getCurrentUserUid() == 'null') {
      loginLayout.style.display = 'block';
      document.getElementById('login-status').textContent = '';
      disableScroll();
    } else {
      var logoutConfirm = confirm(
        'Bạn đang đăng nhập bằng email ' +
          getCurrentUserEmail() +
          '.\nXác nhận đăng xuất?'
      );

      if (logoutConfirm) {
        setCurrentUserEmailAndUid(null, null);
        alert('Đăng xuất thành công!');
      }
    }
  });
  opaqueLayout.addEventListener('click', function () {
    loginLayout.style.display = 'none';
    enableScroll();
  });
}

function initBookingServiceButtons() {
  var viewHistoryElement = document.getElementById('viewBookingHistoryBtn');
  var confirmBookingElement = document.getElementById('confirmBookingBtn');

  if (viewHistoryElement == null || confirmBookingElement == null) return;

  viewHistoryElement.addEventListener('click', function () {
    viewBookingHistory();
  });

  confirmBookingElement.addEventListener('click', function () {
    confirmBooking();
  });
}
/////////////////////////////////////////////////////////////////////

////////////////////////// LOGIN ACTION /////////////////////////////
function validateLogin() {
  var emailField = document.getElementById('login-email').value;
  var passworldField = document.getElementById('login-password').value;
  var loginStatus = document.getElementById('login-status');

  if (!(validString(emailField) && validString(passworldField))) {
    alert('Vui lòng điền đầy đủ email và mật khẩu để đăng nhập!');
    return;
  }

  if (!validateEmail(emailField)) {
    alert('Vui lòng nhập một email hợp lệ!');
    return;
  }

  if (passworldField.length < 6 || passworldField.indexOf(' ') >= 0) {
    alert(
      'Vui lòng nhập mật khẩu hợp lệ.\nMật khẩu hợp lệ là mật khẩu có ít nhất 6 kí tự và không được chứa dấu cách.'
    );
    return;
  }

  fetchSignInMethodsForEmail(auth, emailField).then((signInMethods) => {
    if (signInMethods.length > 0) {
      login(emailField, passworldField);
    } else {
      register(emailField, passworldField);
    }
  });
}
/////////////////////////////////////////////////////////////////////

///////////////////////// BOOKING ACTION ////////////////////////////
function viewBookingHistory() {
  if (getCurrentUserUid() == null || getCurrentUserUid() == 'null') {
    alert('Vui lòng đăng nhập để thực hiện đặt lịch/xem lịch đã đặt!');
    return;
  }
  console.log('Current user nè: ' + getCurrentUserUid());

  readDataById('booking-schedule', getCurrentUserUid()).then(function (data) {
    console.log('Current Data nè: ' + data);
    if (data == null || data == undefined) {
      alert('Bạn chưa đặt lịch. Vui lòng đặt lịch trước!');
      return;
    }

    var username = data['customer_name'];
    var phone_number = data['phone_number'];
    var date = data['date'];
    var service = data['service'];

    var infoAndAskDelete = confirm(
      'THÔNG TIN LỊCH ĐÃ ĐẶT:\nHọ và tên: ' +
        username +
        '\n' +
        'Số điện thoại: ' +
        phone_number +
        '\n' +
        'Ngày đặt lịch: ' +
        date +
        '\n' +
        'Dịch vụ đã đặt: ' +
        service +
        '\n\nBạn có muốn hủy lịch này không?'
    );

    if (infoAndAskDelete) {
      deleteDoc(doc(db, 'booking-schedule', getCurrentUserUid()))
        .then(() => {
          alert('Hủy lịch thành công.');
        })
        .catch((err) => console.error(err));
    }
  });
}

function confirmBooking() {
  if (getCurrentUserUid() == null || getCurrentUserUid() == 'null') {
    alert('Vui lòng đăng nhập để thực hiện đặt lịch/xem lịch đã đặt!');
    return;
  }

  var query = readDataById('booking-schedule', getCurrentUserUid()).then(
    function (data) {
      if (data != null) {
        alert(
          "Bạn đã đặt lịch rồi. Nhấn 'Xem lịch đã đặt' để xem lại lịch đã đặt."
        );
        return;
      }

      var customerName = document.getElementById('customer_name').value;
      var phoneNumber = document.getElementById('phone_number').value;
      var date = document.getElementById('date').value;
      var service = document.getElementById('services').value;

      if (
        !(
          validString(customerName) &&
          validString(phoneNumber) &&
          validString(date) &&
          validString(service)
        )
      ) {
        alert('Vui lòng điền đầy đủ thông tin trước khi đặt lịch!');
        return;
      }

      var data = {
        customer_name: customerName,
        phone_number: phoneNumber,
        date: date,
        service: service,
      };

      writeData('booking-schedule', data).then(() => {
        alert('Đặt lịch thành công!');
      });
      alert('Đang tiến hành đặt lịch ...');
    }
  );
}
////////////////////////////////////////////////////////////////////

/////////////////////////// UTILITIES //////////////////////////////
function validString(string) {
  return string != null && string != undefined && string.length > 0;
}

function validateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

function getCurrentUserUid() {
  return localStorage.getItem('uid');
}

function getCurrentUserEmail() {
  return localStorage.getItem('email');
}

function setCurrentUserEmailAndUid(email, uid) {
  localStorage.setItem('email', email);
  localStorage.setItem('uid', uid);
}

function noscroll() {
  window.scrollTo(0, 0);
}

function disableScroll() {
  window.addEventListener('scroll', noscroll);
  console.log('scroll disabled');
}

function enableScroll() {
  window.removeEventListener('scroll', noscroll);
  console.log('scroll enable');
}
