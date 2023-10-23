import { useTheme } from 'next-themes';
import Head from 'next/head';
import Link from 'next/link';
import Axios from 'axios'
import Router, { useRouter } from 'next/router';
import React, { ReactNode, useId, useState, useEffect } from 'react';
import Select, { StylesConfig } from 'react-select';
import { API_URL, IS_LOCAL } from '@/data/static';
import { marketAllData } from '@/data/marketAll';

interface Option {
  value: string;
  label: string;
}
const options = [
  { value: 'EN', label: 'EN' },
  { value: 'RU', label: 'RU' },
  { value: 'HI', label: 'HI' },
];
//Change the value name
let userOptions = [
  { value: 'userName', label: 'UserName' },
  { value: 'profile', label: 'Profile' },
  { value: 'logout', label: 'Logout' }
]
type Props = {
  children: ReactNode;
  // Other props
}

const soccerMenu = [
  'Bucheon FC 1995 vs Gyeongnam',
  'Bucheon FC 1995 vs Gyeongnam',
  'Bucheon FC 1995 vs Gyeongnam',
  'Bucheon FC 1995 vs Gyeongnam',
  'Bucheon FC 1995 vs Gyeongnam',
  'Bucheon FC 1995 vs Gyeongnam',
  'Bucheon FC 1995 vs Gyeongnam',
  'Bucheon FC 1995 vs Gyeongnam',
  'Bucheon FC 1995 vs Gyeongnam',
  'Bucheon FC 1995 vs Gyeongnam',
  'Bucheon FC 1995 vs Gyeongnam',
  'Bucheon FC 1995 vs Gyeongnam',
  'Bucheon FC 1995 vs Gyeongnam',
]

export default function Layout({ children }: Props) {
  const { theme, setTheme } = useTheme();
  const [selectedOption, setSelectedOption] = useState<Option | null | unknown>(options[0]);
  const [selectedUserOption, setSelectedUserOption] = useState<Option | null | unknown>(userOptions[0]);
  const [balance, setBalance] = useState(0);
  const [liability, setLiability] = useState(0);
  const [user, setUser] = useState<any>();
  
  const [marketData, setMarketData] = useState< Array<any> >();
  const [soccerData, setSoccerData] = useState< Array<any> >();
  const [tennisData, setTennisData] = useState< Array<any> >();
  const [cricketData, setCricketData] = useState< Array<any> >();
  const [horseRaceData, setHorseRaceData] = useState< Array<any> >();
  const [greyhoundData, setGreyhoundData] = useState< Array<any> >();

  const [openMenu2, setOpenMenu2] = useState(true)
  const inactiveTheme = theme === "light" ? "dark" : "light";
  const {pathname} = useRouter();
  const router = useRouter();

  const customStyles: StylesConfig = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: theme !== "dark" ? "#1F493F" : "#D5DDEC",
      borderColor: '#1F493F',
      border: state.isFocused ? '0' : '0',
    }),
    option: (provided,state) => ({
      ...provided,
      color: state.isSelected?'#ffffff':'#000',
      backgroundColor: state.isSelected?'#1F493F':'#ffffff'
    }),
    singleValue: base => ({
      ...base,
      color: theme !== "dark" ? "#fff" : "#000",
      border: 'none'
    }),
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {
    getUserName();
  }, [user]);
  
  useEffect(() => {
    getMarketAll();
  }, []);
  
  const getMarketAll = () => {
    if(IS_LOCAL) {
        setMarketData(marketAllData);
    }
    else {
        Axios.get(`${API_URL}/events`)
        .then(response => {
            setMarketData(response.data);
        })
        .catch(error => {
        });
    }
  }

  useEffect(() => {
      if(marketData) {
          setSoccerData(marketData.filter(data => data.TypeId == 1));
          setTennisData(marketData.filter(data => data.TypeId == 2));
          setCricketData(marketData.filter(data => data.TypeId == 4));
          setHorseRaceData(marketData.filter(data => data.TypeId == 7));
          setGreyhoundData(marketData.filter(data => data.TypeId == 4339));
      }
  }, [marketData]);

  const getUserName = async () => {
    let name = localStorage.getItem("username");
    if(name == null || name == "") {
      setUser( sessionStorage.getItem("username") );
    }
    else {
      setUser(name);
    }
    if(user) {
      userOptions[0].label = user;
      setSelectedUserOption(user);
    }
  }

  const getUserInfo = () => {
    Axios.get(`${API_URL}/client/funds`)
      .then(response => {
        setBalance(response.data.Item1);
        setLiability(response.data.Item2);
      })
      .catch(error => {
      });
  }

  const userOptionClick = (e: any) => {
    if(e.value == "logout") {
      localStorage.removeItem("auth-token");
      localStorage.removeItem("username");
      sessionStorage.removeItem("auth-token");
      sessionStorage.removeItem("username");
      router.push('/login');
    }
    else if(e.value == "profile") {
      router.push('/profile');
    }
  }

  return (
    <>
      <Head>
        <title>Betway - Online Sports Betting and Casino Website</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <header className="header-section header-hidden">
          <div className="header-wrapper">
            <div className="menu-logo-adjust d-flex align-items-center" style={{justifyContent:"flex-start"}}>
              <div className={`header-bar ${openMenu2 && 'active act'}`} onClick={() => setOpenMenu2(!openMenu2)}>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="logo-menu">
                <Link href="/" className="logo">
                  <img src="/img/logo/logo.png" alt="logo" />
                </Link>
                <Link href="/" className="dark-logo">
                  <img src="/img/logo/dark-logo.png" alt="logo" />
                </Link>
              </div>
            </div>

            { /* Header section detail start*/ }
            <div className="right-menu-reature">
              <div className="language">
                <div className='d-flex gap-2 align-items-center'>

                  <div className="glo">
                    <i className="fas fa-globe"></i>
                  </div>
                  <Select
                    instanceId={useId()}
                    defaultValue={selectedOption}
                    onChange={setSelectedOption}
                    options={options}
                    components={{
                      IndicatorSeparator: () => null,
                    }}
                    styles={customStyles}
                  />
                </div>
              </div>
              <div className="mode--toggle" onClick={() => setTheme(inactiveTheme)}>
                <img src={`/img/${theme === 'dark' ? 'moon' : 'sun'}.png`} alt="" />
              </div>

              <div className="full-details">
                <i className="fas fa-wallet p-2"></i>
                <span> Balance: {balance} </span>
              </div>

              <div className="collapse-details">
                <i className="fas fa-wallet p-2"></i>
                <span> {balance} </span>
              </div>

              <div className="divider">
                <span></span>
              </div>

              <div className="full-details">
                <i className="fas fa-handshake p-2"></i>
                <span> Liability: {liability} </span>
              </div>
              <div className="collapse-details">
                <i className="fas fa-handshake p-2"></i>
                <span> {liability} </span>
              </div>

              <div className="divider">
                <span></span>
              </div>

              <div className="full-details">
                <i className="fas fa-user-cog p-2"></i>
                <Select
                  instanceId={useId()}
                  defaultValue={selectedUserOption}
                  onChange={(e) => { userOptionClick(e); }}
                  options={userOptions}
                  components={{
                    IndicatorSeparator: () => null,
                  }}
                  styles={customStyles}
                />
              </div>

              <div className="collapse-details">
                <i className="fas fa-user-cog p-2"></i>
              </div>
            </div>
            { /* Header section detail end*/}

          </div>
        </header>
        {/* <!--==== Header top End  ====== --> */}

        {/* <!--Main Body Section Here--> */}
        {/* <!--Main Body Section Here--> */}
        <div className="main-body">
          {/* <!--Left Box Menu--> */}
          <div className="left-site-menu">
            <div className={`left-box ${openMenu2 && 'active'}`}>
              <header className="header">
                <nav className={`menu ${openMenu2 && 'active act'}`}>
                  <ul className="main-list-menu">
                    <li>
                      <ul className="menu-promot menu-promot-first">  
                        <li>
                          <Link href="/" className={`${pathname == '/' && 'active'}`}>
                            <div className="icon">
                              <i className="icon-home"></i>
                            </div>
                            <span>
                              Home
                            </span>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <ul className="menu-promot menu-promot-bottom">
                        <li className={`original-sub ${pathname == '/soccer' && 'active'}`}>
                          <div className="dd">
                            <div className={`dd-a d-flex align-items-center justify-content-between`}>
                              <div className={`cont d-flex align-items-center`}>
                                <div className="icon">
                                  <i className="icon-football"></i>
                                </div>
                                <span>
                                  Soccer
                                </span>
                              </div>
                              <span>
                                <i className="fas fa-angle-down"></i>
                              </span>
                            </div>
                            <input type="checkbox" />
                            <div className="dd-c">
                              { soccerData &&
                                soccerData.map((soccer: any, index: any) => (
                                  <ul key={index}>
                                    <li>
                                      <Link href="soccer">
                                        <span>
                                          {soccer.Name}
                                        </span>
                                      </Link>
                                    </li>
                                  </ul>
                                ))
                              }
                            </div>
                          </div>
                        </li>
                        
                        <li className={`original-sub ${pathname == '/tennis' && 'active'}`}>
                          <div className="dd">
                            <div className={`dd-a d-flex align-items-center justify-content-between`}>
                              <div className={`cont d-flex align-items-center`}>
                                <div className="icon">
                                  <i className="icon-tennis"></i>
                                </div>
                                <span>
                                  Tennis
                                </span>
                              </div>
                              <span>
                                <i className="fas fa-angle-down"></i>
                              </span>
                            </div>
                            <input type="checkbox" />
                            <div className="dd-c">
                              { tennisData &&
                                tennisData.map((tennis: any, index: any) => (
                                  <ul key={index}>
                                    <li>
                                      <Link href="tennis">
                                        <span>
                                          {tennis.Name}
                                        </span>
                                      </Link>
                                    </li>
                                  </ul>
                                ))
                              }
                            </div>
                          </div>
                        </li>

                        <li className={`original-sub ${pathname == '/cricket' && 'active'}`}>
                          <div className="dd">
                            <div className={`dd-a d-flex align-items-center justify-content-between`}>
                              <div className={`cont d-flex align-items-center`}>
                                <div className="icon">
                                  <i className="icon-cricket"></i>
                                </div>
                                <span>
                                  Cricket
                                </span>
                              </div>
                              <span>
                                <i className="fas fa-angle-down"></i>
                              </span>
                            </div>
                            <input type="checkbox" />
                            <div className="dd-c">
                              { cricketData &&
                                cricketData.map((cricket: any, index: any) => (
                                  <ul key={index}>
                                    <li>
                                      <Link href="cricket">
                                        <span>
                                          {cricket.Name}
                                        </span>
                                      </Link>
                                    </li>
                                  </ul>
                                ))
                              }
                            </div>
                          </div>
                        </li>
                        
                        <li className={`original-sub ${pathname == '/horse-race' && 'active'}`}>
                          <div className="dd">
                            <div className={`dd-a d-flex align-items-center justify-content-between`}>
                              <div className={`cont d-flex align-items-center`}>
                                <div className="icon">
                                  <i className="fas fa-horse-head"></i>
                                </div>
                                <span>
                                  Horse Race
                                </span>
                              </div>
                              <span>
                                <i className="fas fa-angle-down"></i>
                              </span>
                            </div>
                            <input type="checkbox" />
                            <div className="dd-c">
                              { horseRaceData &&
                                horseRaceData.map((horse: any, index: any) => (
                                  <ul key={index}>
                                    <li>
                                      <Link href="horse-race">
                                        <span>
                                          {horse.Name}
                                        </span>
                                      </Link>
                                    </li>
                                  </ul>
                                ))
                              }
                            </div>
                          </div>
                        </li>
                        
                        <li className={`original-sub ${pathname == '/greyhound' && 'active'}`}>
                          <div className="dd">
                            <div className={`dd-a d-flex align-items-center justify-content-between`}>
                              <div className={`cont d-flex align-items-center`}>
                                <div className="icon">
                                  <i className="fas fa-dog"></i>
                                </div>
                                <span>
                                  Greyhound
                                </span>
                              </div>
                              <span>
                                <i className="fas fa-angle-down"></i>
                              </span>
                            </div>
                            <input type="checkbox" />
                            <div className="dd-c">
                              { greyhoundData &&
                                greyhoundData.map((greyhound: any, index: any) => (
                                  <ul key={index}>
                                    <li>
                                      <Link href="greyhound">
                                        <span>
                                          {greyhound.Name}
                                        </span>
                                      </Link>
                                    </li>
                                  </ul>
                                ))
                              }
                            </div>
                          </div>
                        </li>

                        <li>
                          <Link href="poker"  className={`${pathname == '/poker' && 'active'}`}>
                            <div className="icon">
                            <i className="fas fa-donate"></i>
                            </div>
                            <span>
                              Poker
                            </span>
                          </Link>
                        </li>
                        <li>
                          <Link href="supernowa"  className={`${pathname == '/supernowa' && 'active'}`}>
                            <div className="icon">
                              <i className="fas fa-star"></i>
                            </div>
                            <span>
                              Supernowa
                            </span>
                          </Link>
                        </li>
                        <li>
                          <Link href="world-casino"  className={`${pathname == '/world-casino' && 'active'}`}>
                            <div className="icon">
                              <i className="fas fa-globe-americas"></i>
                            </div>
                            <span>
                              World Casino
                            </span>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <ul className="menu-promot menu-promot-end">
                        <li>
                          <Link href="my-markets"  className={`${pathname == '/my-markets' && 'active'}`}>
                            <div className="icon">
                              <i className="fas fa-shopping-cart"></i>
                            </div>
                            <span>
                              My Markets
                            </span>
                          </Link>
                        </li>
                        <li>
                          <Link href="market-rules"  className={`${pathname == '/market-rules' && 'active'}`}>
                            <div className="icon">
                              <i className="fas fa-info-circle"></i>
                            </div>
                            <span>
                              Market Rules
                            </span>
                          </Link>
                        </li>
                        <li>
                          <Link href="terms-conditions"  className={`${pathname == '/terms-conditions' && 'active'}`}>
                            <div className="icon">
                              <i className="fas fa-exclamation-triangle"></i>
                            </div>
                            <span>
                              Terms & Conditions
                            </span>
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </nav>
              </header>
            </div>
          </div>
          {/* <!--Left Box Menu--> */}

          {/* <!--Middle Body--> */}
          <div className="body-middle">

            {children}
            {/* // <!--Footer Section--> */}
            <footer className="footer-section">
              <div className="container">
                <div className="footer-wrapper">
                  <p>
                    Copyright {new Date().getFullYear().toString()} <Link href="#0" className="text-base">Betway</Link> All Rights Reserved.
                  </p>
                  <ul className="footer-link">
                    <li>
                      <Link href="#0">
                        Rules & Regulations
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </footer>
            {/* // <!--Footer Section--> */}

          </div>
        </div>
      </main>
    </>
  )
}