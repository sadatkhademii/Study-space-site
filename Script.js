window.onload = function() {
  // محاسبه روزهای مونده تا کنکور (۷ تیر ۱۴۰۵ = ۲۰۲۶-۰۶-۲۸)
  const konkorDate = new Date('2026-06-28');
  const today = new Date();
  const daysLeft = Math.ceil((konkorDate - today) / (1000 * 60 * 60 * 24));
  document.getElementById('daysToKonkor').innerText = daysLeft + ' روز';

  // نمایش تاریخ و ساعت ایران با حرکت زنده (هر ثانیه بروز)
  function updateDateTime() {
      const now = new Date();
      const date = now.toLocaleDateString('fa-IR', { timeZone: 'Asia/Tehran' });
      const time = now.toLocaleTimeString('fa-IR', { timeZone: 'Asia/Tehran', hour: '2-digit', minute: '2-digit', second: '2-digit' });
      document.getElementById('currentDate').innerText = date;
      document.getElementById('currentTime').innerText = time;
  }
  updateDateTime();
  setInterval(updateDateTime, 1000);

  // وصل به Firebase برای ذخیره دائمی
  const firebaseConfig = {
    apiKey: "AIzaSyBYAI9yq3qlxWTc6QLGtYbXvEmO45RRaLU",
    authDomain: "study-site-78df6.firebaseapp.com",
    projectId: "study-site-78df6",
    storageBucket: "study-site-78df6.firebasestorage.app",
    messagingSenderId: "737923354275",
    appId: "1:737923354275:web:f9936293913fe1b8517916",
    measurementId: "G-TEZ2BRETHS"
  };

  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  // تعریف درس و سرفصل‌ها (با چک برای دیباگ)
  const lessons = {
      'زیست دهم': ['فصل یک', 'فصل دو', 'فصل سه', 'فصل چهار', 'فصل پنج', 'فصل شیش', 'فصل هفت'],
      'زیست یازدهم': ['فصل یک', 'فصل دو', 'فصل سه', 'فصل چهار', 'فصل پنج', 'فصل شیش', 'فصل هفت', 'فصل هشت', 'فصل نه'],
      'زیست دوازدهم': ['فصل یک', 'فصل دو', 'فصل سه', 'فصل چهار', 'فصل پنج', 'فصل شیش', 'فصل هفت', 'فصل هشت'],
      'شیمی دهم': ['فصل یک', 'فصل دو', 'فصل سه'],
      'شیمی یازدهم': ['فصل یک', 'فصل دو', 'فصل سه'],
      'شیمی دوازدهم': ['فصل یک', 'فصل دو', 'فصل سه', 'فصل چهار'],
      'فیزیک دهم': ['فصل یک', 'فصل دو', 'فصل سه', 'فصل چهار'],
      'فیزیک یازدهم': ['فصل یک', 'فصل دو', 'فصل سه'],
      'فیزیک دوازدهم': ['فصل یک', 'فصل دو', 'فصل سه', 'فصل چهار'],
      'زمین شناسی': ['فصل یک', 'فصل دو', 'فصل سه', 'فصل چهار', 'فصل پنج', 'فصل شیش', 'فصل هفت', 'فصل هشت'],
      'ریاضی': ['مجموعه و الگو و دنباله', 'توان های گویا و عبارت جبری', 'معادله نامعادله درجه دو', 'تابع', 'مثلثات', 'توابع نمایی و لگاریتمی', 'هندسه', 'حد و پیوستگی', 'مشتق', 'کاربرد مشتق', 'هندسه دوازدهم', 'شمارش بدون شمردن', 'احتمال'],
      'عمومی': [] 
  };
  console.log('درس‌ها لود شد: ', lessons); // دیباگ، در کنسول ببین

  // پر کردن سلکت درس
  const lessonSelect = document.getElementById('lesson');
  if (lessonSelect) {
      Object.keys(lessons).forEach(lesson => {
          const option = document.createElement('option');
          option.text = lesson;
          lessonSelect.add(option);
      });
      console.log('سلکت درس پر شد');
  } else {
      console.error('سلکت lesson پیدا نشد');
  }

  // بروز سرفصل بر اساس درس
  lessonSelect.addEventListener('change', () => {
      const selectedLesson = lessonSelect.value;
      const subsectionSelect = document.getElementById('subsection');
      if (subsectionSelect) {
          subsectionSelect.innerHTML = '<option>انتخاب سرفصل</option>';
          if (lessons[selectedLesson]) {
              lessons[selectedLesson].forEach(sub => {
                  const option = document.createElement('option');
                  option.text = sub;
                  subsectionSelect.add(option);
              });
              console.log('سرفصل‌ها پر شد برای ' + selectedLesson);
          }
      } else {
          console.error('سلکت subsection پیدا نشد');
      }
      document.getElementById('generalLesson').style.display = selectedLesson === 'عمومی' ? 'block' : 'none';
      document.getElementById('generalSub').style.display = selectedLesson === 'عمومی' ? 'block' : 'none';
  });

  // تابع ذخیره داده (بروز با Firebase)
  function saveData() {
      const lesson = document.getElementById('lesson').value;
      const subsection = document.getElementById('subsection').value;
      const activity = document.getElementById('activity').value;
      const testCount = document.getElementById('testCount').value;
      const testTime = document.getElementById('testTime').value;
      const studyHours = document.getElementById('studyHours').value;
      const studyMinutes = document.getElementById('studyMinutes').value;
      const generalLesson = document.getElementById('generalLesson').value;
      const generalSub = document.getElementById('generalSub').value;

      const studyTime = parseInt(studyHours) + parseInt(studyMinutes) / 60;

      db.collection("lessons").add({
          lesson, subsection, activity, testCount, testTime, studyTime, studyHours, studyMinutes, generalLesson, generalSub, time: new Date().toLocaleString('fa-IR')
      })
      .then(() => {
          alert('ثبت شد!');
      })
      .catch((error) => {
          alert('خطا در ذخیره: ' + error);
      });
  }

  // تابع گزارش (با جدول زیبا، از Firebase)
  function generateReport() {
      db.collection("lessons").get().then((querySnapshot) => {
          let output = '<table><tr><th>درس</th><th>سرفصل</th><th>فعالیت</th><th>تعداد تست</th><th>مدت تست</th><th>زمان مطالعه</th><th>زمان ثبت</th></tr>';
          querySnapshot.forEach((doc) => {
              const item = doc.data();
              const studyDisplay = item.studyHours + ':' + item.studyMinutes;
              output += '<tr><td>' + item.lesson + '</td><td>' + item.subsection + '</td><td>' + item.activity + '</td><td>' + item.testCount + '</td><td>' + item.testTime + '</td><td>' + studyDisplay + '</td><td>' + item.time + '</td></tr>';
              if (item.generalLesson) output += '<tr><td colspan="7">درس عمومی: ' + item.generalLesson + ' - مبحث: ' + item.generalSub + '</td></tr>';
          });
          output += '</table>';
          document.getElementById('reportOutput').innerHTML = output;
          aiAdvice(querySnapshot);
          document.getElementById('reportOutput').innerHTML += '<button onclick="window.print()">پرینت گزارش</button>';
      });
  };

  // تابع AI نصیحت (بروز شده با Firebase)
  function aiAdvice(querySnapshot) {
      let advice = '<p>نصیحت AI: ';
      let totalTime = 0;
      const todayStr = new Date().toLocaleDateString('fa-IR');
      querySnapshot.forEach((doc) => {
          const item = doc.data();
          if (item.time.startsWith(todayStr)) {
              totalTime += item.studyTime || 0;
          }
      });
      const goal = 8; // ساعت هدف، تغییر بده
      if (totalTime < goal) {
          advice += 'امروز کم مطالعه کردی (' + totalTime.toFixed(2) + ' ساعت از ' + goal + ')—فردا تمرکز بیشتر کن!';
      } else {
          advice += 'عالی بودی امروز (' + totalTime.toFixed(2) + ' ساعت)—ادامه بده!';
      }
      advice += '</p>';
      document.getElementById('reportOutput').innerHTML += advice;
  };
};
