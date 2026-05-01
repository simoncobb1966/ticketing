"use client";

export default function Loading() {
  const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  return (
    <div>
      {array.map((item) => {
        return <p key={item}>Loading... {item}</p>;
      })}
    </div>
  );
}
