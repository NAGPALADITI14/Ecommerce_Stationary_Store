"use client"
import React, { Suspense } from 'react';
import Homepage from '@/components/Homepage';

const welcomepage= () => {
  return (<Suspense fallback={<div>Loading...</div>}>
      <Homepage />
    </Suspense>);
};

export default welcomepage;
