const screenWidths = {
  mobileS: '320px',
  mobileM: '375px',
  mobileL: '425px',
  tablet: '768px',
  laptop: '1024px',
  laptopL: '1440px',
  desktop: '2560px'
}

export const device = {
  mobileS: `(min-width: ${screenWidths.mobileS})`,
  mobileM: `(min-width: ${screenWidths.mobileM})`,
  mobileL: `(min-width: ${screenWidths.mobileL})`,
  tablet: `(min-width: ${screenWidths.tablet})`,
  laptop: `(min-width: ${screenWidths.laptop})`,
  laptopL: `(min-width: ${screenWidths.laptopL})`,
  desktop: `(min-width: ${screenWidths.desktop})`
};