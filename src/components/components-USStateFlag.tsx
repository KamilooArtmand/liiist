import React, { useState } from 'react';

interface USStateFlagProps {
  code: string;
  name: string;
  className?: string;
  flagUrl?: string;
}

// Fallback high-resolution Wikimedia Commons vectors for all 50 US State Flags
const WIKIMEDIA_STATE_FLAGS: Record<string, string> = {
  AL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Flag_of_Alabama.svg/320px-Flag_of_Alabama.svg.png',
  AK: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Flag_of_Alaska.svg/320px-Flag_of_Alaska.svg.png',
  AZ: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Flag_of_Arizona.svg/320px-Flag_of_Arizona.svg.png',
  AR: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Flag_of_Arkansas.svg/320px-Flag_of_Arkansas.svg.png',
  CA: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Flag_of_California.svg/320px-Flag_of_California.svg.png',
  CO: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Flag_of_Colorado.svg/320px-Flag_of_Colorado.svg.png',
  CT: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Flag_of_Connecticut.svg/320px-Flag_of_Connecticut.svg.png',
  DE: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Flag_of_Delaware.svg/320px-Flag_of_Delaware.svg.png',
  FL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Flag_of_Florida.svg/320px-Flag_of_Florida.svg.png',
  GA: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Flag_of_Georgia_%28U.S._state%29.svg/320px-Flag_of_Georgia_%28U.S._state%29.svg.png',
  HI: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Flag_of_Hawaii.svg/320px-Flag_of_Hawaii.svg.png',
  ID: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Flag_of_Idaho.svg/320px-Flag_of_Idaho.svg.png',
  IL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Flag_of_Illinois.svg/320px-Flag_of_Illinois.svg.png',
  IN: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Flag_of_Indiana.svg/320px-Flag_of_Indiana.svg.png',
  IA: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Flag_of_Iowa.svg/320px-Flag_of_Iowa.svg.png',
  KS: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Flag_of_Kansas.svg/320px-Flag_of_Kansas.svg.png',
  KY: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Flag_of_Kentucky.svg/320px-Flag_of_Kentucky.svg.png',
  LA: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Flag_of_Louisiana.svg/320px-Flag_of_Louisiana.svg.png',
  ME: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Flag_of_Maine.svg/320px-Flag_of_Maine.svg.png',
  MD: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Flag_of_Maryland.svg/320px-Flag_of_Maryland.svg.png',
  MA: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Flag_of_Massachusetts.svg/320px-Flag_of_Massachusetts.svg.png',
  MI: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Flag_of_Michigan.svg/320px-Flag_of_Michigan.svg.png',
  MN: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Flag_of_Minnesota.svg/320px-Flag_of_Minnesota.svg.png',
  MS: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Flag_of_Mississippi.svg/320px-Flag_of_Mississippi.svg.png',
  MO: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Flag_of_Missouri.svg/320px-Flag_of_Missouri.svg.png',
  MT: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Flag_of_Montana.svg/320px-Flag_of_Montana.svg.png',
  NE: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Flag_of_Nebraska.svg/320px-Flag_of_Nebraska.svg.png',
  NV: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Flag_of_Nevada.svg/320px-Flag_of_Nevada.svg.png',
  NH: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Flag_of_New_Hampshire.svg/320px-Flag_of_New_Hampshire.svg.png',
  NJ: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Flag_of_New_Jersey.svg/320px-Flag_of_New_Jersey.svg.png',
  NM: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Flag_of_New_Mexico.svg/320px-Flag_of_New_Mexico.svg.png',
  NY: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Flag_of_New_York.svg/320px-Flag_of_New_York.svg.png',
  NC: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Flag_of_North_Carolina.svg/320px-Flag_of_North_Carolina.svg.png',
  ND: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Flag_of_North_Dakota.svg/320px-Flag_of_North_Dakota.svg.png',
  OH: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Flag_of_Ohio.svg/320px-Flag_of_Ohio.svg.png',
  OK: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Flag_of_Oklahoma.svg/320px-Flag_of_Oklahoma.svg.png',
  OR: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Flag_of_Oregon.svg/320px-Flag_of_Oregon.svg.png',
  PA: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Flag_of_Pennsylvania.svg/320px-Flag_of_Pennsylvania.svg.png',
  RI: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Flag_of_Rhode_Island.svg/320px-Flag_of_Rhode_Island.svg.png',
  SC: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Flag_of_South_Carolina.svg/320px-Flag_of_South_Carolina.svg.png',
  SD: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_South_Dakota.svg/320px-Flag_of_South_Dakota.svg.png',
  TN: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Flag_of_Tennessee.svg/320px-Flag_of_Tennessee.svg.png',
  TX: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Flag_of_Texas.svg/320px-Flag_of_Texas.svg.png',
  UT: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Flag_of_Utah.svg/320px-Flag_of_Utah.svg.png',
  VT: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Flag_of_Vermont.svg/320px-Flag_of_Vermont.svg.png',
  VA: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Flag_of_Virginia.svg/320px-Flag_of_Virginia.svg.png',
  WA: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Flag_of_Washington.svg/320px-Flag_of_Washington.svg.png',
  WV: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Flag_of_West_Virginia.svg/320px-Flag_of_West_Virginia.svg.png',
  WI: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Flag_of_Wisconsin.svg/320px-Flag_of_Wisconsin.svg.png',
  WY: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Flag_of_Wyoming.svg/320px-Flag_of_Wyoming.svg.png'
};

export const USStateFlag: React.FC<USStateFlagProps> = ({
  code,
  name,
  className = 'w-16 h-10 rounded-lg  object-cover border border-neutral-200/60 dark:border-neutral-700/60 shrink-0',
  flagUrl
}) => {
  const [hasError, setHasError] = useState(false);
  const src = flagUrl || WIKIMEDIA_STATE_FLAGS[code.toUpperCase()];

  if (!src || hasError) {
    return (
      <div
        className={`${className} bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center font-mono text-xs font-bold text-neutral-600 dark:text-neutral-400 select-none`}
        title={`Flag of ${name} (${code})`}
      >
        {code.toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`Official State Flag of ${name}`}
      title={`Official State Flag of ${name} (${code})`}
      onError={() => setHasError(true)}
      loading="lazy"
      className={`${className} object-cover`}
    />
  );
};
