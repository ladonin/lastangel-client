Пример c фильтром
```
const PETS_PAGESIZE = 20;
    
  const petsLoadingStatusRef = useRef({ isLoading: false, isOff: false });
  const petsFilterRef = useRef<TPetsFilterParams>({ statusExclude: ANIMALS_STATUS.AT_HOME });
  const [petsPageState, setPetsPageState] = useState<number>(1);
  const getPetsData = (params?: TGetPetsListRequest) => {
    petsLoadingStatusRef.current.isLoading = true;
    AnimalsApi.getList({ ...petsFilterRef.current, ...params, order: "id", order_type: "DESC" }).then((res) => {
      setListPetsState((prev) => (petsPageState === 1 ? res : [...prev, ...res]));
      petsLoadingStatusRef.current.isLoading = false;
      if (!res.length) {
        petsLoadingStatusRef.current.isOff = true;
      }
    });
  };

  useEffect(() => {
    getPetsData({ offset: (petsPageState - 1) * PETS_PAGESIZE, limit: PETS_PAGESIZE });
  }, [petsPageState]);
  
  const changePetsFilter = (filter: TPetsFilterParams) => {
    petsLoadingStatusRef.current.isOff = false;
    petsFilterRef.current = {
      statusExclude: filter.status && filter.status === 5 ? undefined : ANIMALS_STATUS.AT_HOME,
      ...filter,
    };

    if (petsPageState === 1) {
      getPetsData({ offset: 0, limit: PETS_PAGESIZE });
    } else {
      setPetsPageState(1);
    }
  };
  
  const onReachPetsBottomHandler = () => {
    !petsLoadingStatusRef.current.isOff && !petsLoadingStatusRef.current.isLoading && setPetsPageState((prev) => prev + 1);
  };
  
  {selectedTabIndexState === 0 && <InfiniteScroll onReachBottom={onReachPetsBottomHandler} amendment={100} />}

```
