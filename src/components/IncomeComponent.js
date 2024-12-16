import React, { useState } from 'react';
import { init, useQuery } from '@airstack/airstack-react';

// راه‌اندازی ایراستک با کلید API شما
init("13827f8b8c521443da97ed54d4d6a891d");

const IncomeComponent = () => {
  // State برای تاریخ انتخاب شده
  const [selectedDate, setSelectedDate] = useState('2024-12-16'); // تاریخ پیش‌فرض

  // کوئری برای دریافت اطلاعات درآمد
  const query = `
    query GetMoxiIncome($selectedDate: String!) {
      MoxiIncome(
        input: {
          filter: {
            date: {_eq: $selectedDate}
          },
          blockchain: ALL
        }
      ) {
        Income {
          amount
          date
          user {
            profileName
            fid
          }
        }
      }
    }
  `;

  // استفاده از useQuery برای دریافت داده‌ها
  const { data, loading, error } = useQuery(query, {
    variables: { selectedDate }, // ارسال تاریخ به عنوان ورودی متغیر
  });

  // تابعی برای تغییر تاریخ و بروزرسانی کوئری
  const handleDateChange = (date) => {
    setSelectedDate(date); // تغییر تاریخ انتخاب شده
  };

  if (loading) return <p>در حال بارگذاری...</p>;
  if (error) return <p>خطا: {error.message}</p>;

  return (
    <div>
      <h1>اطلاعات درآمد روزانه موکسی</h1>

      <div>
        <button onClick={() => handleDateChange('2024-12-15')}>15 دسامبر 2024</button>
        <button onClick={() => handleDateChange('2024-12-16')}>16 دسامبر 2024</button>
        <button onClick={() => handleDateChange('2024-12-17')}>17 دسامبر 2024</button>
      </div>

      <h2>درآمد روز {selectedDate}</h2>
      {data && data.MoxiIncome.Income.length > 0 ? (
        <div>
          {data.MoxiIncome.Income.map((income, index) => (
            <div key={index}>
              <p>کاربر: {income.user.profileName}</p>
              <p>مقدار درآمد: {income.amount}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>هیچ داده‌ای برای این تاریخ وجود ندارد.</p>
      )}
    </div>
  );
};

export default IncomeComponent;
init(process.env.REACT_APP_AIRSTACK_API_KEY);
